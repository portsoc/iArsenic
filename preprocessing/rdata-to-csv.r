#!/usr/bin/env Rscript

# Run this script in the console:
# Rscripts [script name] [rdata file/rdata file directory] [output directory]
# [output directory] is not necessary if the output is in the same directory

# Pass directories/files as arguments when running script
args.path = commandArgs(trailingOnly=TRUE)

# Creates the directory if it doesn't exist
dirExists <- function (dirPath) {
  if (!dir.exists(dirPath)) {
    dir.create(dirPath)
  }
}


writeToCsv <- function(filePath, writePath) {
  file.data <- get(load(filePath)) # Loads the data
  file.pathName = sub(pattern = "(.*)\\..*$", replacement = "\\1", basename(filePath)) # Gets the file name from the path

  # Sets the file output path
  if (!is.na(writePath)) {
    file.name = paste(writePath, "/", file.pathName, ".csv", sep="")
  } else {
    file.name = paste(file.pathName, ".csv", sep="")
  }

  dirExists(writePath)
  write.csv(file.data, file=file.name) # Writes the data to a CSV file
  print(paste("File generated at", file.name))
}

rDirToCsv <- function(dirPath, writePath) {
  file.names <- dir(dirPath, pattern="*.RData")
  for(i in 1:length(file.names)) {
    # file.name = paste("data/data++/", file.names[i], ".csv", sep="")
    writeToCsv(paste(dirPath, "/", file.names[i], sep=""), writePath)
    # file.data <- load(file.names[i], verbose="TRUE")
    # write.csv(file.data, "test.csv")
  }
}

# Returns true if a file, false if directory
if (file_test("-f", args.path[1])) {
  writeToCsv(args.path[1], args.path[2]) # If it's one file
} else {
  rDirToCsv(args.path[1], args.path[2]) # If it's a directory of files
}
