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

function build_parva_sidebar()
{
    current_parva = $("#parva-index").data('parva-index');
    max_sections = sections_per_parva[current_parva];
    
    var content = "<div class\"list-group\">";
    for(var i = 1; i <= max_sections; i++)
    {
        content += `<a class="list-group-item" href="/${current_parva}/${i}.html">Section ${i}</a></li>`
    }
    content += "</div>";
    $("#parva-index").html(content);
}