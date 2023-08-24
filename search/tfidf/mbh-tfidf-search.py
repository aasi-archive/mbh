# Search for a word in KMG's Mahabharata
# (C) AASI_Amsha, 2023

# Usage: python mbhsearch <WORD>

import json
import sys

# If you want more than 30 results, change this
MAX_RESULTS = 30
# Have this file downloaded in directory same as this script
tf_file = open("mb_tfidf.json", "r")

TF_INDEX = json.loads(tf_file.read())
tf_file.close()

search_term = sys.argv[1].lower()

if(len(search_term) == 0):
    exit(-1)

if(search_term in TF_INDEX):
    verses_tf = TF_INDEX[search_term]
    search_results = sorted(verses_tf.items(), key=lambda x:x[1])[:MAX_RESULTS]
    verses = [verse[0] for verse in search_results]

    print(f"Found `{search_term}` in: (showing {MAX_RESULTS} results)")
    for verse in verses:
        parva, verse_no = verse.split(":")
        print("Parva\t", parva, "\tVerse\t", verse_no)

else:
    print("No such term found.")