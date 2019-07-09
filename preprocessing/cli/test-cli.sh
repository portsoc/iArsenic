#!/bin/bash
modelCommands=( "" "-m model1" "-m model3" )
preprocessor="produce-aggregate-data-files.js"
pathCommands=( "" "-p /iArsenic/data/disabled/29k-original.csv" )
testDirectory="$(date +"%F")-test"
benchmarkDirectory="benchmark-test"

#generates the directory structure
#uses node to create the model and data specific JS files
for m in "${modelCommands[@]}"
do
  if [ "$m" = "" ]; then
    modelSubDirectory="default-model"
  else
    modelSubDirectory="$(echo $m | cut -b 4-)"
  fi

  for p in "${pathCommands[@]}"
  do
    if [ "$p" = "" ]; then
      dataDirectory="default-data"
    else
      #use parent directory + csv filename to use as test directory name
      #logic: reverse the string, take fields 1-2 with '/' as delimiter
        #remove the file extensions and put the string back in normal order
        #replace '/' with _ and '*' with all-files
      dataDirectory=$(echo "$p" | rev | cut -d '/' -f 1-2 | cut -d '.' -f 2- | rev | sed 's/\//_/g; s/*/all-files/g')
    fi
    completeDirectory="$testDirectory/$modelSubDirectory/$dataDirectory"
    mkdir -p $completeDirectory
    node $preprocessor $m -o $completeDirectory
  done
done

#comapre test directory against the benchmark directory ignoring JS comments
diffOutput="$(diff -q -r -I '//' $testDirectory $benchmarkDirectory)"
if [ "$diffOutput" = "" ]; then
  echo Test successful: the directories are identical
else
  echo $diffOutput
fi
