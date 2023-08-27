/* 
    Translate server to be loaded in config.json 
    NOTE: The reason why we can't just query translate.google.com
    from JS is that it does not allow a CORS request, instead our 
    aasi-flask-server does that for us (and it allows CORS requests.)
*/
var translate_server = null;

/* Card which shows the translation */
var translate_element = `<div class="card shadow-lg w-25 translation-card" id="translation-card">
            <div class="card-header">
                <h5 class="card-title" style="float:left;">Sanskrit &#10132; English Translation</h5>
                <button class="btn btn-warning btn-sm rounded shadow" style="float:right;" onClick="$('#translation-card').fadeOut()"><span class="fa fa-x"></span></button>
            </div>
            <div class="card-body">
                <div id="translation-content" class="fs-6">

                </div>
            </div>
            <div class="card-footer">
                <i>Powered by Google Translate.</i>
            </div>
        </div>`

/* Button which does the translation */
var translate_button = `<button class="btn btn-warning btn-translator fs-6" onclick="translate_selection()"><span class="fa fa-language"></span>&nbsp;सं &#10132; EN</b></button>`;

var translation_loading_spinner = `
    <div class="spinner-border text-warning" role="status">
    <span class="sr-only">Loading...</span>
    </div>
`;

/* Add the Translation Element */
$(document).ready( () => {
    $.getJSON("/config.json", (data) => {
        translate_server = data["translate_server"];
        console.log(translate_server);
    });
    $('body').append(translate_button);
    $('body').append(translate_element);
    $('#translation-card').hide();
});

/* Get Selected Text */
function get_selection_text() 
{
    var text = "";
    if (window.getSelection) 
    {
        text = window.getSelection().toString();
    } 
    else if (document.selection && document.selection.type != "Control") 
    {
        text = document.selection.createRange().text;
    }
    return text;
}

function translate_selection()
{
    var selection_text = get_selection_text();
    if(selection_text.length > 0)
    {
        /* Show the translation card */
        $("#translation-card").fadeIn();
        /* Add a loading spinner */
        $("#translation-content").html(translation_loading_spinner);
        translate_text('sa', 'en', selection_text, (english) => {
            /* Set HTML to translated text */
            $("#translation-content").html(english)
        });
    }
}

/* Sends a request to the translation server and returns the text in a callback */
function translate_text(source_lang, target_lang, text, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 0)
        {
            if(callback)
            {
                callback('An Error Occurred.');
            }
            return;
        }

        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            if(Object.keys(json).length == 0)
            {
                if(callback)
                {
                    callback('An Error Occurred.');
                }
                return;
            }

            var result = json["text"];
            if(callback)
            {
                callback(result);
            }
        }
    };

    var url = translate_server;
    var data = JSON.stringify({"text": text, "sl": source_lang, "tl": target_lang});
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}