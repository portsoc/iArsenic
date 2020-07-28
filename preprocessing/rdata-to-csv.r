#!/usr/bin/env Rscript

# Run script in the console:
# Rscripts [script name] [rdata file/rdata file directory] [output directory]
# [output directory] is not necessary if the output is in the same directory

# Pass directories/files as arguments when running script
args = commandArgs(trailingOnly=TRUE)

# Creates the directory if it doesn't exist
dirExists <- function (dirPath) {
  if (!dir.exists(dirPath)) {
    dir.create(dirPath)
  }
}

# Convert RData file to CSV and output into current or specified directory
writeToCsv <- function(filePath, writePath) {
  file.data <- get(load(filePath)) # Loads the RData

  # Gets the file name from the path
  file.name = sub(pattern = "(.*)\\..*$", replacement = "\\1", basename(filePath))

  # Sets the file output path
  if (!is.na(writePath)) {
    dirExists(writePath)
    file.path = paste(writePath, "/", file.name, ".csv", sep="") # Set file path and name
  } else {
    file.path = paste(file.name, ".csv", sep="") # Set file name
  }
  write.csv(file.data, file=file.path) # Writes the data to a CSV file
  print(paste("File generated at", file.path))
}

# Convert RData files in directory to CSV
rDirToCsv <- function(dirPath, writePath) {
  # Find all RData files
  file.names <- dir(dirPath, pattern="*.RData")

  # Loop through directory files
  for(i in 1:length(file.names)) {
    file.path = paste(dirPath, "/", file.names[i], sep="") # Set file path
    writeToCsv(file.path, writePath)
  }
}


# Checks if arguments has been passed
if (!is.na(args[1])) {

  # Returns true if a file, false if a directory
  if (file_test("-f", args[1])) {
    writeToCsv(args[1], args[2]) # If it's one file
  } else {
    rDirToCsv(args[1], args[2]) # If it's a directory of files
  }
} else {
  print("No arguments passed, stopping script...")
}
