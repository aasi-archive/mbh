# This is a search server
# Configure the URL where it is hosted on in ./build/config.json

from flask import Flask, request, abort, jsonify
from flask_cors import CORS, cross_origin
import json
import re
import sys

MAX_RESULTS = 100
SURROUNDING_CHARS_MAX = 30

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

with open('search_index.json', 'r') as f:
    search_index = json.loads(f.read())
    f.close()

@app.route("/api/mbh/search", methods=['POST'])
@cross_origin()
def search_result():
    query = request.json
    results = {}
    total_results = 0 
    if(query['text'] == 'MBH'):
        regx = re.compile(query['query'], flags=re.DOTALL|re.MULTILINE)
        for section in search_index.keys():
            if(total_results > MAX_RESULTS):
                break
            n = len(search_index[section])
            for mtch in regx.finditer(search_index[section]):
                results[section] = {}
                results[section]["start"] = mtch.start()
                pre_match_start = mtch.start() - SURROUNDING_CHARS_MAX
                pre_match_end = mtch.start()

                post_match_start = mtch.start() + len(mtch.group())
                post_match_end =  post_match_start + SURROUNDING_CHARS_MAX

                if(pre_match_start < 0):
                    pre_match_start = 0
                    pre_match_end = mtch.start()

                if(post_match_start > n):
                    post_match_start = n - SURROUNDING_CHARS_MAX
                    post_match_end = n - 1

                results[section]["surrounding"] = "..." + search_index[section][pre_match_start:pre_match_end]  + '<span class="query_match">' + mtch.group() + '</span>' + search_index[section][post_match_start:post_match_end] + "..."
                total_results += 1

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
