#!/bin/bash

#static global variables
scriptDir=`dirname $0`
dataPaths=( "" "$scriptDir/../../data/disabled/29k-original.csv" )
models=( "" "model1" "model3" )
producer="$scriptDir/../cli/produce-aggregate-data-files.js"
tester="$scriptDir/../cli/test-all.js"
testerOutputFile="test-all-output.txt"
testDirectory="$scriptDir/test-outputs/$(date +"%F-%H-%M-%S")"
benchmarkDirectory="$scriptDir/benchmark-data"
invokeOutputPath="-o"

generateDataDirectory () {
  parentDirectory="${dataPath%/*}"
  parentDirectory="${parentDirectory##*/}"

  dataFilename="${dataPath##*/}"
  dataFilename="${dataFilename%.*}"
  # dataFilename="$(echo $dataFilename | sed 's/*/all-files/g')"
  if [ "$dataFilename" = "*" ]; then
    dataFilename="all-files"
  fi

  dataOutputDirectory="$parentDirectory"_"$dataFilename"
}

compareOutput () {
  if [ -d "$benchmarkDirectory" ]; then
    diffOutput="$(diff -q -r -I '//' $testDirectory $benchmarkDirectory)"
    if [ "$diffOutput" = "" ]; then
      echo -e "Test successful: \n$testDirectory/ and $benchmarkDirectory/ are identical"
    else
      echo -e "Test failed: \n$diffOutput"
    fi
  else
    echo -e "Directory $benchmarkDirectory/ not found"
    echo -e "To make $testDirectory/ the benchmark directory, execute the following:\n"
    echo "mv $testDirectory/ $benchmarkDirectory/"
  fi
}

main () {
  echo "outputing into $testDirectory"
  echo "running:"

  for model in "${models[@]}"
  do
    modelID="default-model"
    invokeModel=""
    if [ "$model" != "" ]; then
      modelID="$model"
      invokeModel="-m"
    fi

    for dataPath in "${dataPaths[@]}"
    do
      dataOutputDirectory="default-data"
      invokeDataPath=""
      if [ "$dataPath" != "" ]; then
        generateDataDirectory
        invokeDataPath="-p"
      fi
      echo "  model ${model:-'default'} with data ${dataPath:-'default'}"
      outputPath="$testDirectory/$modelID/$dataOutputDirectory"
      mkdir -p $outputPath
      node $producer $invokeModel $model $invokeDataPath $dataPath $invokeOutputPath $outputPath >/dev/null # suppress output
      node $tester $invokeModel $model $invokeDataPath $dataPath > $outputPath/$testerOutputFile
    done
  done

  compareOutput
}

main
