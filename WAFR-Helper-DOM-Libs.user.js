// ==UserScript==
// @name         WAFR-Review-Helper-Libs
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.0.1
// @description  OH_Get_Workload_Attr --> parse the URL
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @run-at       document-end
// ==/UserScript==

function div_reset_innerHTML(id)
{
    var div = document.getElementById(id);
    div.innerHTML = '';
}

function div_append_text(id, text)
{
    var div = document.getElementById(id);
    div.innerHTML += text;
}

function div_append_child(id, ele)
{
    var div = document.getElementsById(id);
    div.appendChild(ele);
}

function div_format_key_value_to_text(key, value)
{
    return '<h2>' + key + '</h2>' + '<p>' + value + '</p><hr />';
}

function div_format_value_list_to_text(value)
{

    var value_text = '';
    JSON_value.forEach(append_to_text);
    function append_to_text(item, index){
        value_text += " - " + item + "<br />";
    }
    return value_text;
}