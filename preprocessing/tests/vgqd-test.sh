#!/bin/bash

# Currently this script operates much like test-cli.sh but only uses the
# locations present within the VGQD (which contains the actual arsenic values)

# Unlike test-cli.sh, the tester used in this script does not just output the
# results, but compares the results against VGQD and discerns the accuracy.
# This result is then stored in a csv file, however a decision has not been made
# regarding what to do with this output file yet.

# ------------------------------------------------------------------------------

# Declare static global values including what data to use, what models and where
# to store the results. Timestamps are used for directory names
scriptDir=`dirname $0`
cd "$scriptDir"

dataPaths=( "" "../../data/disabled/29k-original.csv" )
producer="../cli/produce-aggregate-data-files.js"
tester="../cli/test-verygoodquality.js"
testerOutputFile="test-verygoodquality-output.csv"
testDirectory="vgqd-tests-outputs/$(date +"%F-%H-%M-%S")"
invokeOutputPath="-o"

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

  # Override date within aggregate data files to ensure testing is accurate
  # Files such as estimators etc
  export OVERRIDE_DATE="overridden date for test output comparability"

  # Complete tests for each model defined in global variables, including default

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
    node $tester $invokeDataPath $dataPath | sed -n '/^div.*/,$p' > $outputPath/$testerOutputFile
  done


}

main
