#!/bin/bash

#static global variables
scriptDir=`dirname $0`
cd "$scriptDir"

dataPaths=( "" "../../data/disabled/29k-original.csv" )
models=( "" "model1" "model3" "model4" "model5" )
producer="../cli/produce-aggregate-data-files.js"
tester="../cli/test-all.js"
testerOutputFile="test-all-output.txt"
testDirectory="test-outputs/$(date +"%F-%H-%M-%S")"
benchmarkDirectory="benchmark-data"
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
    diffOutput="$(diff -q -r $testDirectory $benchmarkDirectory)"
    if [ "$diffOutput" = "" ]; then
      echo
      echo "Test successful: $scriptDir/$testDirectory/ is identical to benchmark"
      echo
      echo "The test output is big, you may want to delete it:"
      echo "rm -r $scriptDir/$testDirectory/"
    else
      echo -e "Test failed in $scriptDir/: \n$diffOutput"
    fi
  else
    echo -e "Directory $scriptDir/$benchmarkDirectory/ not found"
    echo -e "To make $scriptDir/$testDirectory/ the benchmark directory, execute the following:\n"
    echo "mv $scriptDir/$testDirectory/ $scriptDir/$benchmarkDirectory/"
  fi
}

main () {
  echo "outputing into $scriptDir/$testDirectory"
  echo "running:"

  export OVERRIDE_DATE="overridden date for test output comparability"

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
