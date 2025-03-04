import json

def load_region_tree(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)
