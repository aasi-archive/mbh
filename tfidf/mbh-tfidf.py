import os
import re
from bs4 import BeautifulSoup
import math
import json

EXCLUSION_LIST = [ 'a', 'an', 'the', 
                  'is', 'am', 'are', 
                  'was', 'were', 'will',
                  'of', 'in', 'on',
                  'has', 'have', 'had',
                  'i', 'he', 'she', 'they',
                  'them', 'him', 'her', 'his',
                  'hers', 'having']

MAX_FLOAT_DIGITS = 8
INDEX_ROOT_DIR = '..\\..\\build\\'
TFIDF_LOCATION = "...\..\\build\\tfidf.json"
DIV_TO_INDEX = ['mbh_content']
EXTENSIONS = ['.html']
TF_INDEX = {}
IDF_INDEX = {}

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
        if(os.path.isdir(item_path)):
            diritem_array += GetAllItemsInDirectory(item_path)
        else:
            for extension in EXTENSIONS:
                if(item_path.endswith(extension)):
                    diritem_array.append(item_path)
                    break
    
    return diritem_array

def FilePathToTFIndexer(path):
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

def TF(file, content):
    # Tokenize content
    tokens = re.split(';| |\t|\n|\r|\"|\'|,|&|\(|\)|\{|\}|\.|\?|\u2014', content)
    tokens = list(filter(('').__ne__, tokens))
    tokens = [token.lower() for token in tokens]

    n = float(len(tokens))
    file_index = FilePathToTFIndexer(file)

    for token in tokens:
        if(token in EXCLUSION_LIST):
            continue

        if(token in TF_INDEX):
            if(file_index in TF_INDEX[token]):
                TF_INDEX[token][file_index] = round(TF_INDEX[token][file_index] + 1.0 / n, MAX_FLOAT_DIGITS)
            else:
                TF_INDEX[token][file_index] = round(1.0 / n, MAX_FLOAT_DIGITS)
        else:
            TF_INDEX[token] = { file_index: round(1.0 / n, MAX_FLOAT_DIGITS) }
    
    print("Indexed: " + file)

def IDF(D):
    for token in TF_INDEX:
        token_IDF = round(math.log10(D / (1.0 + float(len(TF_INDEX[token])))), MAX_FLOAT_DIGITS)
        for file in TF_INDEX[token]:
            TF_INDEX[token][file] = round(TF_INDEX[token][file] * token_IDF, MAX_FLOAT_DIGITS)

files_to_index = GetAllItemsInDirectory(INDEX_ROOT_DIR)
D = len(files_to_index)
for file in files_to_index:
    with open(file, 'r') as fp:
        soup = BeautifulSoup(fp, 'html.parser')
        content = soup.find(id='to_index')
        if(content):
            TF(file, content.get_text())

IDF(D)
print("Completed TF-IDF for given data.")
print("Writing to tfidf.json")

with open(TFIDF_LOCATION, "w") as tf_file:
    tf_file.write(json.dumps(TF_INDEX, separators=(',', ':')))