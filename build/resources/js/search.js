search_server = null;
global_result_selector = null
query_error_string = `No matches found. Here could be the following reasons:
<ul>
    <li>Your query actually does not exist in the corpus (note: regex is case-sensitive).</li>
    <li>Corpus has some UTF-8 issues, these are fixed over time.</li>
    <li>The search server is down, try searching something simple like "Krishna" to see if you get a result.</li>
</ul>
`;

server_error = `There was an error while requesting the search server. It may be down. 
Contact site administrator if you see this message. Alternatively, you can host
this whole website locally cloning the repo along with the search server.`

spinner_html = `
<div class="spinner-border text-success" role="status" id="search-spinner">
    <span class="sr-only">Loading...</span>
</div>
`
/* Get the search server from config */
$(document).ready( () => {
    $.getJSON("/config.json", (data) => {
        search_server = data["search_server"];
        console.log(search_server);
    });
});

function mbh_search(result_selector, query_selector)
{
    $(result_selector).empty();
    /* Add a spinner */
    $(result_selector).append(spinner_html);
    /* Disable the search button */
    $("#search_button").attr('disabled', true);

    query = $(query_selector).val();
    global_result_selector = result_selector
    
    var xhr = new XMLHttpRequest();
    
    xhr.onerror = () => {
        $(global_result_selector).html(server_error);
    };

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 0)
        {
            $(global_result_selector).html(server_error);
            $("#search-spinner").remove();
            $("#search_button").attr('disabled', false);
        }

        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#search-spinner").remove();
            $("#search_button").attr('disabled', false);
            var json = JSON.parse(xhr.responseText);
            if(Object.keys(json).length == 0)
            {
                $(global_result_selector).html(query_error_string);
                return;
            }

            var result_content = "<table class=\"table styled-table\">";
            result_content += "<thead><tr><th>Parva/Section</th><th>Match</th></tr></thead><tbody>"
            for(const key in json)
            {
                parva_section = key.split(":");
                result_url = "/" + parva_section[0] + "/" + parva_section[1] + ".html";
                result_content += "<tr>";
                result_content += "<td><a href=\"" + result_url + "\">" + key + "</a></td>";
                result_content += "<td>" + json[key]["surrounding"] + "</td>";
                result_content += "</tr>";
            }
            result_content += "</tbody></table>"
            $(global_result_selector).html(result_content)
        }
    };

    var url = search_server;
    var data = JSON.stringify({"text": "MBH", "query": query});
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}