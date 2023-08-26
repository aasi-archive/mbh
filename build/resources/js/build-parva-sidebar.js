parva_english_titles = {
    0: "Mahabharata",
    1: "The Beginning",
    2: "The Assembly Hall",
    3: "The Forest",
    4: "Incognito",
    5: "Reconciliation",
    6: "Bhishma",
    7: "Drona",
    8: "Karna",
    9: "Shalya",
    10: "The Sleeping Warriors",
    11: "The Wailing Women",
    12: "Peace",
    13: "Instructions",
    14: "The Horse Sacrifice",
    15: "Hermitage",
    16: "The Curse",
    17: "The Great Journey",
    18: "The Ascent"
}

parva_sanskrit_titles = {
    0: "महाभारतम्",
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
};


sections_per_parva = { 
    1: 236,
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
    18: 6
};

chapters_per_parva_sanskrit = {
    1: 225,
    2: 72,
    3: 299,
    4: 67,
    5: 197,
    6: 117,
    7: 173,
    8: 69,
    9: 64,
    10: 18,
    11: 27,
    12: 353,
    13: 154,
    14: 96,
    15: 47,
    16: 9,
    17: 3,
    18: 5
};

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
};

function n2HIn(n)
{
    var s = n.toString();
    var result = "";
    for(var i = 0; i < s.length; i++)
    {
        result += HI_numbers[s[i]];
    }
    return result;
}

function increase_font_size(id, increaseFactor)
{
    txt = document.getElementsByClassName(id)[0];
    style = window.getComputedStyle(txt, null).getPropertyValue('font-size');
    currentSize = parseFloat(style);
    txt.style.fontSize = (currentSize*increaseFactor) + 'px';
}

function add_font_zoom_buttons()
{
    zoom_buttons = `<div class="zoom-button">
    <button class="btn btn-warning" onClick="increase_font_size('mbh-content', 1.1)">
    <span class="fa fa-lg fa-search-plus px-2"></span>
    </button>

    <button class="btn btn-warning" onClick="increase_font_size('mbh-content', 0.9)">
    <span class="fa fa-lg fa-search-minus px-2"></span>
    </button>
    </div>`;

    $('body').append(zoom_buttons);
}

function generate_mahabharata_navigator(language, current_parva, link_prefix)
{
    mahabharata_navigator = `
    <img src="/resources/images/sidebar.png" class="sidebar-button-right" type="button" data-bs-toggle="offcanvas"
    data-bs-target="#mahabharata_offcanvas" aria-controls="mahabharata_offcanvas">

    <div class="offcanvas offcanvas-end" tabindex="-1" id="mahabharata_offcanvas" aria-labelledby="mahabharata_offcanvas_label">

    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="mahabharata_offcanvas_label">${language[0]}</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body shadow-lg" id="mahabharata-index">
    </div>
    `;
    /* Add the Mahabahrata navigator */
    $('body').append(mahabharata_navigator);

    /* Add the book links in the MBh navigator */
    var mahabharata_navigator_list = `<div class="list-group">`;
    for(var i = 1; i <= 18; i++)
    {
        var active = "";
        if(i == current_parva)
        {
            active = "active";
        }
        mahabharata_navigator_list += `<a class="list-group-item ${active}" href="${link_prefix}/${i}/1.html">${language[0] == 'Mahabharata' ? i.toString() : n2HIn(i)}. ${language[i]}</a>`;
    }
    mahabharata_navigator_list += "</div>";
    $('#mahabharata-index').html(mahabharata_navigator_list);
}

function finish_sidebar()
{
    /* Add event listener for left and right buttons */
    document.addEventListener('keydown', (e) => {
        if(e.key == 'ArrowLeft')
        {
            window.location.href = $("#previous-parva-btn").attr('href');
        }
        else if(e.key == 'ArrowRight')
        {
            window.location.href = $("#next-parva-btn").attr('href');
        }
    });
    add_font_zoom_buttons();
}

function build_parva_sidebar_sanskrit()
{
    current_parva = $("#parva-index").data('parva-index');
    current_chapter = $("#parva-index").data('chapter-index');

    max_chapters = chapters_per_parva_sanskrit[current_parva];
    
    var content = "<div class\"list-group\">";
    for(var i = 1; i <= max_chapters; i++)
    {
        /* Highlight current section */
        var active = "";
        if(i == current_chapter)
        {
            active = "active";
        }

        content += `<a class="list-group-item ${active}" href="/sanskrit/${current_parva}/${i}.html">अध्याय ${n2HIn(i)}</a></li>`
    }
    content += "</div>";
    $("#parva-index").html(content);
    generate_mahabharata_navigator(parva_sanskrit_titles, current_parva, '/sanskrit');
    finish_sidebar();
}

function build_parva_sidebar()
{
    current_parva = $("#parva-index").data('parva-index');
    current_section = $("#parva-index").data('section-index');

    max_sections = sections_per_parva[current_parva];
    
    var content = "<div class\"list-group\">";
    for(var i = 1; i <= max_sections; i++)
    {
        /* Highlight current section */
        var active = "";
        if(i == current_section)
        {
            active = "active";
        }

        content += `<a class="list-group-item ${active}" href="/${current_parva}/${i}.html">Section ${i}</a>`
    }
    content += "</div>";
    $("#parva-index").html(content);
    generate_mahabharata_navigator(parva_english_titles, current_parva, '')
    finish_sidebar();
}

