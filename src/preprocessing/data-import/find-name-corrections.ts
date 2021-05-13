import * as csvLoader from '../lib/load-data';
import * as cli from '../lib/cli-common';
import * as nameCorrections from '../lib/name-corrections';
import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import colors from 'colors';
import { BasicDataSet, Region } from '../lib/types';
import PromptSync from 'prompt-sync';

const prompt = PromptSync();

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

interface RegionWithSubRegions {
  subRegionsArr: Region[],
  subRegions: {[index: string]: Region},
}

interface RegionWithParentRegion {
  parentRegion: Region,
}

type RelativeRegion = Region & Partial<RegionWithParentRegion> & Partial<RegionWithSubRegions>;
type RelativeDataSet = RelativeRegion[];


export interface HierarchyTree {
  oldName: string,
  oldParentPath: string[],
  subRegionsArr: HierarchyTree[],
  correctParentPath?: string[],
  correctName?: string,
}

function correct(correctNameData: RelativeDataSet, region: HierarchyTree, correctionFile: string) {
  if (correctDataContains(correctNameData, ...region.correctParentPath || [], region.oldName)) {
    // it's already correct
    region.correctName = region.oldName;
    return true;
  }

  const correction = chooseCorrection(region, correctNameData);

  // correct the region name in the data
  region.correctName = correction.region.name;

  if (correction.type === 'cousin') {
    const correctParentRegion = correction.region.parentRegion as Region;
    region.correctParentPath = findRegionNamePath(correctParentRegion);
  } else if (correction.type === 'none') {
    region.correctParentPath = [];
  }

  // save the correction
  const csvCorrection = {
    path: [...region.oldParentPath, region.oldName],
    correct: [...region.correctParentPath || [], region.correctName],
  };
  appendCorrectionToFile(csvCorrection, correctionFile);

  return correction.type !== 'none';
}

function appendCorrectionToFile(correction: {path: string[], correct: string[]}, correctionFile: fs.PathLike) {
  // create an empty output file if it doesn't exist yet
  if (!fs.existsSync(correctionFile)) {
    const headers = 'path,correct' + '\n';
    fs.appendFileSync(correctionFile, headers);
  }

  const correctionRecord =
    correction.path.join('#') + ',' +
    correction.correct.join('#') + '\n';
  fs.appendFileSync(correctionFile, correctionRecord);
}

function highlightCommonSubregions(regionsToList: string[], regionsToHighlight: string[], commonSubregions?: string[]) {
  const retarr = [];
  for (let name of regionsToList) {
    if (regionsToHighlight.includes(name)) {
      if (commonSubregions) commonSubregions.push(name);
      name = colors.blue(name);
    }
    retarr.push(name);
  }
  const regionString = retarr.join(', ');
  return retarr.length === 0 ? '' : `(${colors.italic(regionString)})`;
}

export interface SelectableRegion {
  type: string,
  region: RelativeRegion,
}

const regionLabels = ['division', 'district', 'upazila', 'union'];

function chooseCorrection(misspeltRegion: HierarchyTree, correctNameData: RelativeDataSet) {
  // only shows regions inside misspelt region's parent region
  // corrections to parent region names are made on the fly
  const misspeltSubregionNames = misspeltRegion.subRegionsArr.map(r => r.oldName).sort();

  const correctedRegionPath = misspeltRegion.correctParentPath || [];

  const misspeltRegionNameBold = colors.bold(misspeltRegion.oldName);
  const regionLabel = regionLabels[correctedRegionPath.length];
  const commonSubregions: string[] = [];

  // returns array of all sibling regions and cousin regions with common sub regions to the misspeltRegion
  // [{ type: 'sibling' OR 'cousin', region: regionObject}]
  const selectableRegions = getSelectableRegions(
    correctNameData,
    misspeltRegion,
    misspeltSubregionNames,
  );

  const optionsList = generateOptionsTable(selectableRegions, misspeltSubregionNames, commonSubregions);

  const misspeltSubregionString = highlightCommonSubregions(misspeltSubregionNames, commonSubregions);

  let promptText = optionsList + '\n\n';
  if (correctedRegionPath.length > 0) {
    promptText += 'In ' + correctedRegionPath.join(' -> ') + '\n';
  }
  promptText += 'Incorrect ' + regionLabel + ': ' + misspeltRegionNameBold + ' ' + misspeltSubregionString;

  while (true) {
    console.log(promptText);
    const userInput = prompt('Input ID of correct spelling: ');

    // quit on ctrl-c
    if (userInput == null) process.exit(0);

    // if user presses enter skip this correction
    if (userInput === '') {
      console.log(colors.green.bold(`SKIPPING ${regionLabel} ${misspeltRegionNameBold}`));
      const returnVal: SelectableRegion = {
        type: 'none',
        region: {
          name: nameCorrections.SKIPPED_CORRECTION,
          wells: [],
        },
      };
      return returnVal;
    }

    const inputIsValid = validInput(parseInt(userInput), selectableRegions.length);
    if (inputIsValid) {
      const selected = selectableRegions[parseInt(userInput) - 1];
      console.log(colors.green.bold(`Selected: ${selected.region.name}`));
      return selected;
    }

    // input wasn't valid
    console.log(colors.red.bold(`\nINVALID INPUT, please enter a number 1-${selectableRegions.length}`));
  }
}

// MUST return "sibling" regions before "cousin" regions
function getSelectableRegions(correctNameData: RelativeDataSet, misspeltRegion: HierarchyTree, misspeltSubregionNames: string[]) {
  const selectableRegions: SelectableRegion[] = [];

  const correctSiblings = getCorrectlySpelledSiblingRegions(correctNameData, misspeltRegion);

  // put all sibling regions into selectable region array
  for (const sibling of correctSiblings) {
    selectableRegions.push({ type: 'sibling', region: sibling });
  }

  const cousinRegions = getCousinRegions(correctNameData, misspeltRegion);

  // only put cousin regions with common subregions to the misspelt region in the selectable regions array
  for (const cousinRegion of cousinRegions) {
    const cousinSubregionNames = getSubregionNames(cousinRegion);
    if (doArraysIntersect(misspeltSubregionNames, cousinSubregionNames)) {
      selectableRegions.push({ type: 'cousin', region: cousinRegion });
    }
  }

  return selectableRegions;
}

function doArraysIntersect<T>(arr1: T[], arr2: T[]) {
  for (const item of arr1) {
    if (arr2.includes(item)) return true;
  }
  return false;
}

function generateOptionsTable(selectableRegions: SelectableRegion[], misspeltSubregionNames: string[], commonSubregions: string[]) {
  let optionsString = '';

  // this assumes getSelectableRegions returned sibling regions before cousin regions
  const siblings = selectableRegions.filter(region => region.type === 'sibling');
  const cousins = selectableRegions.filter(region => region.type === 'cousin');

  optionsString = appendOptionsString(0, optionsString, misspeltSubregionNames, commonSubregions, siblings);

  if (cousins.length === 0) return optionsString;

  optionsString += `\n\n${colors.yellow('We also found potential corrections to cousin regions below')}\n`;
  optionsString = appendOptionsString(siblings.length, optionsString, misspeltSubregionNames, commonSubregions, cousins);

  return optionsString;
}

function appendOptionsString(startingIndex: number, optionsString: string, misspeltSubregionNames: string[], commonSubregions: string[], selectableRegions: SelectableRegion[]) {
  for (let i = 0; i < selectableRegions.length; i += 1) {
    const optionName = selectableRegions[i].region.name;
    const optionSubregions =
      selectableRegions[i].region.subRegions
        ? getSubregionNames(selectableRegions[i].region)
        : [];
    const optionSubregionsHighlighted = highlightCommonSubregions(optionSubregions, misspeltSubregionNames, commonSubregions);
    let parentName = '';
    if (startingIndex === 0) {
      const region = selectableRegions[i].region as Required<RelativeRegion>;
      parentName += `${region.parentRegion?.name} -> `;
    }
    optionsString += `\n${colors.yellow((startingIndex + i + 1).toString())} ${parentName}${optionName} ${optionSubregionsHighlighted}`;
  }
  return optionsString;
}

// return subregions of all subregions (except for region's parent) of region's parent's parent
function getCousinRegions(correctNameData: RelativeDataSet, region: HierarchyTree) {
  // a division doesn't have any cousins
  if (region.correctParentPath === undefined) return [];

  const parent = findRegionByNameArr(correctNameData, region.correctParentPath) as Region & RegionWithParentRegion;

  const grandParent = parent.parentRegion as Region & RegionWithSubRegions;

  // we may not have grandParent if region is a district
  const parentLevelRegions = grandParent != null
    ? grandParent.subRegionsArr as (Region & RegionWithSubRegions)[]
    : Object.values(correctNameData) as (Region & RegionWithSubRegions)[];

  // get all the subregions of grandParent except for parent
  const uncleRegions = parentLevelRegions.filter(r => r.name !== parent.name && r.subRegionsArr !== undefined);


  // return subregions of all the uncle regions
  return uncleRegions.flatMap(r => r.subRegionsArr);
}

function getSubregionNames(region: Partial<RegionWithSubRegions>
& Partial<RegionWithParentRegion>
& Region) {
  // Region is lowest level region
  if (region.subRegionsArr == null) return [''];

  const namesArr = region.subRegionsArr.map(r => r.name);
  return namesArr.sort();
}

function validInput(input: number, regionArrLength: number) {
  if (input > regionArrLength || input <= 0) return false; // if answer out of bounds of array
  if (isNaN(input)) return false; // if answer is not a number return false
  return true;
}

function getCorrectlySpelledSiblingRegions(correctNameData: RelativeDataSet, region: HierarchyTree) {
  if (region.oldParentPath.length === 0) {
    // if region is a division, sibling names are values in correctNameData
    return Object.values(correctNameData).sort((a, b) => a.name.localeCompare(b.name));
  } else {
    const parentNameArr = region.correctParentPath || [];
    const correctlyNamedParent = findRegionByNameArr(correctNameData, parentNameArr) as Region & RegionWithSubRegions;
    return correctlyNamedParent.subRegionsArr.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function findRegionNamePath(region: Region & Partial<RegionWithParentRegion>) {
  let currentRegion: Region & Partial<RegionWithParentRegion> | undefined = region;
  const names = [];

  while (currentRegion != null) {
    names.unshift(currentRegion.name);
    currentRegion = currentRegion.parentRegion;
  }
  return names;
}

function findRegionByNameArr(dataset: RelativeDataSet, arr: string[]) {
  const div = dataset.find(elem => elem.name === arr[0]) as Region & RegionWithSubRegions;
  if (arr.length === 1) return div;

  const dis = div.subRegions[arr[1]] as Region & RegionWithSubRegions;
  if (arr.length === 2) return dis;

  const upa = dis.subRegions[arr[2]] as Region & RegionWithSubRegions;
  if (arr.length === 3) return upa;

  const uni = upa.subRegions[arr[3]];
  return uni;
}

function correctDataContains(correctNameData: RelativeDataSet, ...regionNames: string[]): boolean {
  const [topLevelName, ...restOfNames] = regionNames;

  if (correctNameData === undefined) return false;

  const topRegion = correctNameData.find(elem => elem.name === topLevelName) as Region & RegionWithSubRegions;

  // check the first name in search matches the top level of correctNameData
  if (topRegion == null) return false;

  // if we're not searching any deeper, we're done
  if (restOfNames.length === 0) return true;

  // check for the deeper names in the subregions
  return correctDataContains(topRegion.subRegionsArr, ...restOfNames);
}

function getRelativeRegionLinks(dataset: BasicDataSet<Region>) {
  const regions: RelativeDataSet = [];

  for (const div of Object.values(dataset)) {
    const newDiv: Region & RegionWithSubRegions = {
      wells: div.wells,
      name: div.name,
      subRegions: div.districts,
      subRegionsArr: Object.values(div.districts),
    };
    regions.push(newDiv);
    for (const dis of Object.values(div.districts)) {
      const newDis: Region & RegionWithSubRegions & RegionWithParentRegion = {
        wells: dis.wells,
        name: dis.name,
        subRegions: dis.upazilas,
        subRegionsArr: Object.values(dis.upazilas),
        parentRegion: newDiv,
      };
      newDiv.subRegionsArr.push(newDis);
      newDiv.subRegions[newDis.name] = newDis;
      for (const upa of Object.values(dis.upazilas)) {
        const newUpa: Region & RegionWithSubRegions & RegionWithParentRegion = {
          wells: upa.wells,
          name: upa.name,
          subRegions: upa.unions,
          subRegionsArr: Object.values(upa.unions),
          parentRegion: newDis,
        };
        newDis.subRegionsArr.push(newUpa);
        newDis.subRegions[newUpa.name] = newUpa;
        for (const uni of Object.values(upa.unions)) {
          const newUni: Region & RegionWithParentRegion = {
            wells: uni.wells,
            name: uni.name,
            parentRegion: newUpa,
          };
          newUpa.subRegionsArr.push(newUni);
          newUpa.subRegions[newUni.name] = newUni;
        }
      }
    }
  }

  return regions;
}

// turn the hierarchy of possibly misspelt data into a tree like this:
// [
//   {
//     oldName,
//     oldParentPath,
//     subRegionsArr: [...],
//   }
// ]

function extractHierarchyTree(dataset: BasicDataSet<Region>) {
  const retval: HierarchyTree[] = [];
  for (const div of Object.values(dataset)) {
    const divObj: HierarchyTree = {
      oldName: div.name,
      oldParentPath: [],
      subRegionsArr: [],
      correctParentPath: [],
    };
    retval.push(divObj);

    for (const dis of Object.values(div.districts)) {
      const disObj: HierarchyTree = {
        oldName: dis.name,
        oldParentPath: [div.name],
        subRegionsArr: [],
      };
      divObj.subRegionsArr.push(disObj);

      for (const upa of Object.values(dis.upazilas)) {
        const upaObj: HierarchyTree = {
          oldName: upa.name,
          oldParentPath: [div.name, dis.name],
          subRegionsArr: [],
        };
        disObj.subRegionsArr.push(upaObj);

        for (const uni of Object.values(upa.unions)) {
          const uniObj: HierarchyTree = {
            oldName: uni.name,
            oldParentPath: [div.name, dis.name, upa.name],
            subRegionsArr: [],
          };
          upaObj.subRegionsArr.push(uniObj);
        }
      }
    }
  }
  return retval;
}

function checkForMissingFlags(cliArgs: cli.CliParameters) {
  if (cliArgs.inputFile == null || cliArgs.output == null) {
    console.warn(colors.red.bold('Please specify input file (-i flag) and output file (-o flag)'));
  }
}

async function main(cliArgsPromise: Promise<cli.CliParameters>) {
  const cliArgs = await cliArgsPromise;
  checkForMissingFlags(cliArgs);
  const correctNameData = csvLoader.loadData(cliArgs.paths);

  // load existing corrections
  const correctionFile = cliArgs.output;
  if (fs.existsSync(correctionFile)) {
    const corrections = parse(fs.readFileSync(correctionFile), CSV_PARSE_OPTIONS) as nameCorrections.Correction[];
    nameCorrections.loadCorrections(corrections);
  }

  const dataToCorrect = cliArgs.inputFile;
  const uncheckedNameData = extractHierarchyTree(csvLoader.loadData(dataToCorrect, { correct: nameCorrections.correctRegionName }));

  const relativeCorrectNameData = getRelativeRegionLinks(correctNameData);

  const correctionQueue = Array.from(Object.values(uncheckedNameData));
  while (correctionQueue.length > 0) {
    const region = correctionQueue.shift() as HierarchyTree;

    const corrected = correct(relativeCorrectNameData, region, correctionFile);
    if (corrected) {
      // add the subregions to the queue
      for (const subRegion of region.subRegionsArr) {
        // give each subRegion a (currently known) correctParentPath
        subRegion.correctParentPath = [...region.correctParentPath || [], region.correctName || ''];
        correctionQueue.push(subRegion);
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters()).catch(console.error);
