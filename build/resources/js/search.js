search_server = null;
global_result_selector = null
query_error_string = `No matches found. Here could be the following reasons:
<ul>
    <li>Your query actually does not exist in the corpus (note: regex is case-sensitive).</li>
    <li>Corpus has some UTF-8 issues, these are fixed over time.</li>
    <li>The search server is down, try searching something simple like "Krishna" to see if you get a result.</li>
</ul>
`;

/* Get the search server from config */
$(document).ready( () => {
    $.getJSON("/config.json", (data) => {
        search_server = data["search_server"];
        console.log(search_server);
    });
});

function mbh_search(result_selector, query_selector)
{
    query = $(query_selector).val();
    global_result_selector = result_selector
    var xhr = new XMLHttpRequest();
    var url = search_server;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
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
    var data = JSON.stringify({"text": "MBH", "query": query});
    xhr.send(data);
}