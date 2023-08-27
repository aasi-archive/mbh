# This indexes the entire corpus into a search_index.json

import os
import re
from bs4 import BeautifulSoup
import math
import json

SEARCH_INDEX_JSON = 'mbh.json'
INDEX_ROOT_DIR = '.\\build\\'
DIV_TO_INDEX = ['mbh-content']
IGNORE_DIR = ['.\\build\\sanskrit']
EXTENSIONS = ['.html']
SEARCH_INDEX = {}

def atoi(text):
    return int(text) if text.isdigit() else text

def NaturalSort(text):
    '''
    .sort(key=NaturalSort) sorts in human order
    http://nedbatchelder.com/blog/200712/human_sorting.html
    (See Toothy's implementation in the comments)
    '''
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]

def GetAllItemsInDirectory(path):
    items = os.listdir(path)
    items.sort(key=NaturalSort)
    diritem_array = []
    for item in items:
        item_path = os.path.join(path, item)
        if(os.path.isdir(item_path) and item_path not in IGNORE_DIR):
            diritem_array += GetAllItemsInDirectory(item_path)
        else:
            for extension in EXTENSIONS:
                if(item_path.endswith(extension)):
                    diritem_array.append(item_path)
                    break
    
    return diritem_array

def FilePathToIndexer(path):
    # Path is of the form
    # ./build/<parva>/<verse>.html
    # We want to turn this into
    # <parva>,<verse>
    # Remove index root dir and html
    path = path.replace(INDEX_ROOT_DIR, '')
    path = path.replace('.html', '')
    # Split by '\\'
    parva_verse = path.split('\\')
    return parva_verse[0] + ":" + parva_verse[1]

def AddToSearchIndex(file, content):
    indexloc = FilePathToIndexer(file)
    SEARCH_INDEX[indexloc] = content.replace("\n", " ").replace("\t", " ").replace("\u2014", "-")

files_to_index = GetAllItemsInDirectory(INDEX_ROOT_DIR)
D = len(files_to_index)
for file in files_to_index:
    with open(file, 'r', encoding='utf-8') as fp:
        soup = BeautifulSoup(fp, 'html.parser')
        content = soup.find(id='to_index')
        print("Index: ", file)
        if(content):
            AddToSearchIndex(file, content.get_text(separator = '\n', strip = True))

print("Completed indexing for given data.")
print("Writing to mbh.json")

with open(SEARCH_INDEX_JSON, "w", encoding='utf-8') as tf_file:
    tf_file.write(json.dumps(SEARCH_INDEX, separators=(',', ':')))