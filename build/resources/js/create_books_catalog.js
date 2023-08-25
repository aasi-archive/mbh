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

parva_summaries = {
    1: "How the Mahabharata came to be narrated at the Assembly of Scholars at Naimisha, originally compiled at Taxila.",
    2: "The humiliation of the Five Pandava Heroes and Draupadi in the Assembly Hall by the Kauravas.",
    3: "The twelve years of struggle of the Pandavas in exile.",
    4: "The last year of exile spent by the Heroes and Draupadi in the court of Virata under a faux identity.",
    5: "The final attempt at reconciliation with the Kauravas, the Great War begins.",
    6: "The first part of the Great War, with Grandsire Bhishma as commander of the Kaurava forces.",
    7: "The battle continues, with Preceptor Drona as commander.",
    8: "After Drona's death, Karna assumes command of the Kaurava army.",
    9: "The last day of the battle, with Shalya as commander. Duryodhana is slain by Bhima.",
    10: "A disgruntled Ashwatthama plots an attack at night and kills many soldiers of the Pandava army.",
    11: "The women of the Kauravas and Pandavas lament their dead husbands and sons and curse Krishna.",
    12: "Peace is achieved at Hastinapura and Yudhiṣṭhira is crowned King.",
    13: "The instructions given by Grandisre Bhishma to Yudhiṣṭhira before his death on the Bed of Arrows.",
    14: "The Horse Sacrifice is conducted by the newly crowned King. Arjuna conquers beyond.",
    15: "The eventual deaths of the Elders: Dhritrashtra, Gandhari, and Kunti in a forest fire while in their hermitage.",
    16: "The materialisation of Gandhari's curse, the Yadavas infight with maces, killing each other.",
    17: "The Five Heroes and Draupadi make their great journey to the top of the world, at the Himalayas, where each falls except the virtuous Yudhisthira.",
    18: "Yudhiṣṭhira and his companion dog (which turns out to be Dharmadeva himself) ascend to Heaven, welcomed by Indra on his chariot."
}

function create_parva_card(parva_idx)
{
    content = '<div class="col-lg-3 col-md-4 col-sm-6 d-flex align-items-stretch">';
    content += '<div class="card shadow-lg my-3 mx-auto">';
    content += `<div class="card-header"><h4>Book ${parva_idx}</h4><b>${parva_titles[parva_idx]}</b></div>`;
    content += '<div class="card-body mx-auto">'
    content += `<img src="/resources/images/parva${parva_idx}.jpg" class="book-thumbnail" width="192px" height="256px"><br></div>`;
    content += `<hr><div class="container h-75 small-text"><p>${parva_summaries[parva_idx]}</p></div>`;
    content += '<div class="card-footer">'
    content += `<a style="float:right" href="/${parva_idx}/1.html" class="btn btn-warning"><span class="fa fa-book"></span>&nbsp;Read</a>`;
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