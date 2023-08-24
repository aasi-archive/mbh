parva_titles = {
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

function create_parva_card(parva_idx)
{
    content = '<div class="col-lg-3 col-md-4 col-sm-6 d-flex align-items-stretch">';
    content += '<div class="card shadow-lg my-3">';
    content += `<div class="card-header"><h4>Book ${parva_idx}</h4><b>${parva_titles[parva_idx]}</b></div>`;
    content += '<div class="card-body mx-auto">'
    content += `<img src="/resources/images/parva${parva_idx}.jpg" width="192px" height="256px"><br></div>`
    content += '<div class="card-footer">'
    content += `<a style="float:right" href="/${parva_idx}/1.html" class="btn btn-primary"><span class="fa fa-book"></span>&nbsp;Read</a>`;
    content += '</div></div></div>'
    return content;               
}

function create_parva_catalog(selector)
{
    for(var i = 1; i <= 18; i++)
    {
        $(selector).append(create_parva_card(i));
    }
}