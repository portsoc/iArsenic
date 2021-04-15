#!/bin/bash

# Currently this script operates much like test-cli.sh but only uses the
# locations present within the VGQD (which contains the actual arsenic values)

# Unlike test-cli.sh, the tester used in this script does not just output the
# results, but compares the results against VGQD and discerns the accuracy.
# This result is then stored in a csv file.

# ------------------------------------------------------------------------------

# Declare static global values including what data to use and where
# to store the results. Timestamps are used for directory names
scriptDir=`dirname $0`
cd "$scriptDir"

dataPaths=( "" "../../data/disabled/29k-original.csv" )
tester="../cli/test-verygoodquality.js"
testerOutputFile="test-verygoodquality-output.csv"
testDirectory="vgqd-tests-outputs/$(date +"%F-%H-%M-%S")"

# Generates output directories using the name of the selected dataset
generateDataDirectory () {
  parentDirectory="${dataPath%/*}"
  parentDirectory="${parentDirectory##*/}"

  dataFilename="${dataPath##*/}"
  dataFilename="${dataFilename%.*}"
  if [ "$dataFilename" = "*" ]; then
    dataFilename="all-files"
  fi

  dataOutputDirectory="$parentDirectory"_"$dataFilename"
}

main () {
  echo "outputing into $scriptDir/$testDirectory"
  echo "running:"

  # Test each model against the current and previous datasets
  for dataPath in "${dataPaths[@]}"
  do
    dataOutputDirectory="default-data"
    invokeDataPath=""
    if [ "$dataPath" != "" ]; then
      generateDataDirectory
      invokeDataPath="-p"
    fi

    # Output current task for the user
    echo "  testing vgqd with data ${dataPath:-'default'}"
    outputPath="$testDirectory/$dataOutputDirectory"
    mkdir -p $outputPath
    node $tester $invokeDataPath $dataPath > $outputPath/$testerOutputFile
  done


}

main
