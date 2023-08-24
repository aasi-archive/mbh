import os
import colorama
import re
import jinja2

MBH_TXT_DIR = "./txt/"
MBH_BUILD_DIR = "./build/"

PARVA_MIN = 1
PARVA_MAX = 18

# Convert integer to string with n_digits minimum.
def n2str(n, n_digits):
    str_n = str(n)
    if(len(str_n) < n_digits):
        left = n_digits - len(str_n)
        for i in range(0, left):
            str_n = "0" + str_n
    return str_n

# Convert Roman numeral to integer
def roman2n(roman_str):
    try:
        i = int(roman_str)
        return i
    except:
        roman_values_map = { "I": 1, 
                            "V": 5,
                            "X": 10,
                            "L": 50,
                            "C": 100,
                            "D": 500,
                            "M": 1000}
        result = 0
        i = len(roman_str) - 1
        current_val = roman_values_map["I"]
        while(i >= 0):
            c = roman_str[i]
            if(c not in roman_values_map):
                raise Exception("Invalid Roman Digit: " + c)
            val = roman_values_map[c]
            if(val < current_val):
                result -= val
            else:
                result += val
            current_val = val
            i -= 1
        return result

def generate_MBh_filename(parva, section, prefix=MBH_BUILD_DIR):
    return os.path.join(prefix, f"{parva}/{section}.html")

# Output HTML for each section
def sanitize_to_HTML(content):
    # Remove leading and trailing spaces and add line breaks
    content = (content.strip(' \n\t')).replace("\n", "<br>")
    # Replace -- with HTML dash
    content = content.replace("--", "&#8212;")
    return content

def render_MBh_content(parva, section, content):
    templateLoader = jinja2.FileSystemLoader(searchpath="./")
    jinja2_env = jinja2.Environment(loader=templateLoader)
    page_template = jinja2_env.get_template('verse.template.html')

    # Get Maximum Sections in this parva
    previous_page = ""
    next_page = ""
    max_sections = sections_per_parva[parva]
    if(section <= max_sections and section > 1):
        previous_page = generate_MBh_filename(parva, section - 1, prefix='')
    elif(section == 1 and parva > PARVA_MIN):
        previous_page = generate_MBh_filename(parva - 1, sections_per_parva[parva - 1], prefix='')
    
    if(section < max_sections):
        next_page = generate_MBh_filename(parva, section + 1, prefix='')
    elif(section == max_sections and parva < PARVA_MAX):
        next_page = generate_MBh_filename(parva + 1, 1, prefix='')

    page_info = { "parva": parva, 
                 "section": section, 
                 "section_content": sanitize_to_HTML(content),
                 "next_page_url": next_page,
                 "previous_page_url": previous_page }

    file_path = generate_MBh_filename(parva, section)
    file_dir = os.path.dirname(file_path)
    os.makedirs(file_dir, exist_ok=True)

    with open(file_path, mode="w", encoding="utf-8") as page:
        page.write(page_template.render(page_info))
        page.close()

# Generate file (parva) list
file_list = ["maha" + n2str(i, 2) + ".txt" for i in range(1, 18+1)]

# The following parvas are messed up:
# 08, 09, 10, 11, 16, 17, 18
# They do not use "SECTION <ROMAN NUMERAL>" and instead prefer
# using just "<SECTION NUMBER>" followed by a newline.
# So we need to fix that.

files_to_fix = ["maha08.txt",
                "maha09.txt",
                "maha10.txt",
                "maha11.txt",
                "maha16.txt",
                "maha17.txt",
                "maha18.txt"]

sections_per_parva = { 1: 236,
                       2: 80,
                       3: 313,
                       4: 72,
                       5: 199,
                       6: 124,
                       7: 203,
                       8: 96,
                       9: 65,
                       10: 18,
                       11: 27,
                       12: 365,
                       13: 168,
                       14: 92,
                       15: 39,
                       16: 8,
                       17: 3,
                       18: 6}

def read_mbh_txt(file):
    f = open(os.path.join(MBH_TXT_DIR, file))
    file_data = ''.join(f.readlines())

    # Split footnotes
    regx_footnotes = re.compile(r'^FOOTNOTES$', flags=re.DOTALL|re.MULTILINE)
    footnote_split = re.split(regx_footnotes, file_data)

    content = footnote_split[0]
    footnotes = ""
    if(len(footnote_split) == 2):
        footnotes = footnote_split[1]
    else:
        print(f"No footnotes for: {file}")

    # If its one of those files, fix it.
    if file in files_to_fix:
        regx = re.compile(r'^([0-9]+)$', flags=re.DOTALL|re.MULTILINE)
        content = re.sub(regx, r'SECTION \1\n', content)
        return re.split("SECTION ([0-9]+)", content), footnotes
    
    return re.split("SECTION ([IVXLCDM]+)", content), footnotes

if __name__ == "__main__":
    for parva in range(0, len(file_list)):
        splitted_content, footnotes = read_mbh_txt(file_list[parva])

        sections = []
        section_numbers = []
        # Ignore first (0) section as it is always the preface
        for i in range(1, len(splitted_content)):
            if i % 2:
                # Section number
                section_numbers.append(roman2n(splitted_content[i]))
            else:
                sections.append(splitted_content[i])
        
        if(len(sections) == sections_per_parva[parva+1]):
            print(colorama.Fore.GREEN + f"Parva: {parva+1}, all sections parsed." + colorama.Fore.RESET)
        else:
            print(section_numbers)
            print(colorama.Fore.RED + f"Parva: {parva+1}, error while parsing, expected: {sections_per_parva[parva+1]}, got: {len(sections)}!" + colorama.Fore.RESET)
            #exit(-1)

        for i in range(0, len(sections)):
            #print(f"Rendering {parva+1}:{section_numbers[i]}")
            render_MBh_content(parva+1, section_numbers[i], sections[i])