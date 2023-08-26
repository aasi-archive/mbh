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

function enable_arrow_navigation()
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
    enable_arrow_navigation();
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

        content += `<a class="list-group-item ${active}" href="/${current_parva}/${i}.html">Section ${i}</a></li>`
    }
    content += "</div>";
    $("#parva-index").html(content);
    enable_arrow_navigation();
}

