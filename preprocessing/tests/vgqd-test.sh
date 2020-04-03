#!/bin/bash

#static global variables
scriptDir=`dirname $0`
cd "$scriptDir"

dataPaths=( "" "../../data/disabled/29k-original.csv" )
models=("model1" "model3" "model4")
producer="../cli/produce-aggregate-data-files.js"
tester="../cli/test-verygoodquality.js"
testerOutputFile="test-verygoodquality-output.csv"
testDirectory="vgqd-tests-outputs/$(date +"%F-%H-%M-%S")"
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

main () {
  echo "outputing into $scriptDir/$testDirectory"
  echo "running:"

  export OVERRIDE_DATE="overridden date for test output comparability"

  for model in "${models[@]}"
  do

    for dataPath in "${dataPaths[@]}"
    do
      dataOutputDirectory="default-data"
      invokeDataPath=""
      if [ "$dataPath" != "" ]; then
        generateDataDirectory
        invokeDataPath="-p"
      fi
      echo "  model ${model:-'default'} with data ${dataPath:-'default'}"
      outputPath="$testDirectory/$model/$dataOutputDirectory"
      mkdir -p $outputPath
      echo "$dataPath"
      node $tester $invokeModel $model $invokeDataPath $dataPath > $outputPath/$testerOutputFile
    done
  done
}

main
