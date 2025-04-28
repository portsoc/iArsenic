# Model6

## How does this model differ from model5

- dropdown data generated from geodata
- geodata cookie-cutter modification applied
- model patch used
- switch to python

## How to produce model estimates

poetry install
poetry run python main.py

## How to upload model estimates to google cloud

gsutil -m rsync -r model/ gs://iarsenic-model6
