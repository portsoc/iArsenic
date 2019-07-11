#!/bin/bash

#static global variables
dataPaths=( "" "../../data/disabled/29k-original.csv" )
models=( "" "model1" "model3" )
preprocessor="produce-aggregate-data-files.js"
testDirectory="test-$(date +"%F-%H-%M-%S")"
benchmarkDirectory="./test-benchmark"
invokeOutputPath="-o"

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

compareOutput () {
  if [ -d "$benchmarkDirectory" ]; then
    diffOutput="$(diff -q -r -I '//' $testDirectory $benchmarkDirectory)"
    if [ "$diffOutput" = "" ]; then
      echo -e "Test successful: \n$testDirectory and $benchmarkDirectory are identical"
    else
      echo -e "Test failed: \n$diffOutput"
    fi
  else
    echo -e "Directory $benchmarkDirectory/ not found"
    echo -e "To make $testDirectory the benchmark directory, execute the following:\n"
    echo "mv $testDirectory $benchmarkDirectory"
  fi
}

main () {
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
      outputPath="$testDirectory/$modelID/$dataOutputDirectory"
      mkdir -p $outputPath
      node $preprocessor $invokeModel $model $invokeDataPath $dataPath $invokeOutputPath $outputPath
    done
  done

  compareOutput
}

main
