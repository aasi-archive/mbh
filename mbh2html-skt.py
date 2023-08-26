import os 
import json
import jinja2

MBH_BUILD_DIR = './build/'
PARVA_MAX = 18
HI_numbers = {
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
    "0": "०",
    ".": "." 
}

parva_titles_sanskrit = {
    1: "आदिपर्व",
    2: "सभापर्व",
    3: "वनपर्व", 
    4: "विराटपर्व", 
    5: "उद्योगपर्व",
    6: "भीष्मपर्व", 
    7: "द्रोणपर्व", 
    8: "कर्णपर्व", 
    9: "शल्यपर्व", 
    10: "सौप्तिकपर्व", 
    11: "स्त्रीपर्व", 
    12: "शान्तिपर्व", 
    13: "अनुशासनपर्व", 
    14: "अश्वमेधिकपर्व",  
    15: "आश्रंवासिकपर्व", 
    16: "मौसलपर्व", 
    17: "महाप्रस्थानिक पर्व", 
    18: "स्वर्गारोहण पर्व"
}

parva_index = {}

with open('txt/mb_entire.json', 'r', encoding='utf-8') as f:
    mbh_sanskrit = json.loads(f.read())["mahabharata_data"]

# Convert number to Hindi number
def n2HIn(n):
    return ''.join([HI_numbers[c] for c in str(n)])

def SANSKRIT_generate_parva_index():
    for parva in range(0, PARVA_MAX):
        parva_data = mbh_sanskrit[parva]["book_data"]
        n_chapters = len(parva_data)
        parva_index[parva] = n_chapters

def SANSKRIT_generate_chapter_path(parva, chapter, prefix=MBH_BUILD_DIR):

    return os.path.join(prefix, f'sanskrit/{parva+1}/{chapter+1}.html')

def SANSKRIT_render_MBh_chapter(parva, chapter, output):
    global mbh_sanskrit
    chapter_data = mbh_sanskrit[parva]["book_data"][chapter]["chapter_data"]
    n_verses = len(chapter_data)
        
    verse_array = []
    for verse in range(0, n_verses):
        verse_item = {}
        verse_item["header"] = f'{n2HIn(parva+1)}.{n2HIn(chapter+1)}.{n2HIn(verse+1)}'
        verse_item["content"] = '<br>'.join(chapter_data[verse]["verse_data"])
        verse_array.append(verse_item)

    templateLoader = jinja2.FileSystemLoader(searchpath="./")
    jinja2_env = jinja2.Environment(loader=templateLoader)
    page_template = jinja2_env.get_template('verse-skt.template.html')


    previous_page = "/"
    next_page = "/"
    max_chapters = parva_index[parva]
    if(chapter <= max_chapters and chapter > 0):
        previous_page = SANSKRIT_generate_chapter_path(parva, chapter - 1, prefix='')
    elif(chapter == 0 and parva > 0):
        previous_page = SANSKRIT_generate_chapter_path(parva - 1, parva_index[parva - 1] - 1, prefix='')
    
    if(chapter < max_chapters - 1):
        next_page = SANSKRIT_generate_chapter_path(parva, chapter + 1, prefix='')
    elif(chapter == max_chapters - 1 and parva < PARVA_MAX - 1):
        next_page = SANSKRIT_generate_chapter_path(parva + 1, 0, prefix='')

    page_info = { "parva": n2HIn(parva+1), 
                "chapter": n2HIn(chapter+1),
                "parva_eng_num": parva+1,
                "chapter_eng_num": chapter+1, 
                "verses": verse_array,
                "next_page_url": next_page,
                "previous_page_url": previous_page,
                "parva_title": parva_titles_sanskrit[parva+1]}
    
    with open(output, "w", encoding='utf-8') as f:
        f.write(page_template.render(page_info))
        f.close()

SANSKRIT_generate_parva_index()
for parva in range(0, PARVA_MAX):
    parva_data = mbh_sanskrit[parva]["book_data"]
    n_chapters = len(parva_data)
    
    print(f"Generating Sanskrit HTML for Parva {parva+1}, {n_chapters} chapters...")
    for chapter in range(0, n_chapters):
        file_path = SANSKRIT_generate_chapter_path(parva, chapter)
        file_dir = os.path.dirname(file_path)
        os.makedirs(file_dir, exist_ok=True)
        SANSKRIT_render_MBh_chapter(parva, chapter, file_path)