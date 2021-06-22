// ==UserScript==
// @name         WAFR-Review-Helper-Libs
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.0.1
// @description  Div related functions.
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @run-at       document-end
// ==/UserScript==

function div_reset_innerHTML(id)
{
    var div = document.getElementById(id);
    if(div != undefined)
    div.innerHTML = '';
}

function div_append_text(id, text)
{
    var div = document.getElementById(id);
    if(div != undefined)
    div.innerHTML += text;
}

function div_append_child(id, ele)
{
    var div = document.getElementsById(id);
    if(div != undefined && ele != undefined)
    div.appendChild(ele);
}

function div_format_key_value_to_text(key, value)
{
    return '<h2>' + key + '</h2>' + '<p>' + value + '</p><hr />';
}

function div_ani_click_toggle(...args)
{
    if(args.length<2) return false;

    var click_ele  = args[0];
    var toggle_ele = args[1];
    var text = "";
    if(args.length==3)
        text = args[2];

    var header = document.getElementById(click_ele);
    var content = document.getElementById(toggle_ele);
    if(content.style.display == 'none'){
        content.style.display = 'block';
        header.innerHTML = text + '▲';
    }
    else {
        content.style.display = 'none';
        header.innerHTML = text + '▼';
    }
}

function div_ani_click_collapse(...args)
{
    if(args.length<2) return false;

    var click_ele  = args[0];
    var collapse_ele = args[1];
    var text = "";
    if(args.length==3)
        text = args[2];

    var header = document.getElementById(click_ele);
    var content = document.getElementById(collapse_ele);

    content.style.display = 'none';
    header.innerHTML = text + '▼';

}

function div_ani_click_expend(...args)
{
    if(args.length<2) return false;

    var click_ele  = args[0];
    var expend_ele = args[1];
    var text = "";
    if(args.length==3)
        text = args[2];

    var header = document.getElementById(click_ele);
    var content = document.getElementById(expend_ele);
    
    content.style.display = 'block';
    header.innerHTML = text + '▲';
}

function div_format_value_list_to_text(value)
{

    var value_text = '';
    value.forEach(append_to_text);
    function append_to_text(item, index){
        value_text += " - " + item + "<br />";
    }
    return value_text;
}

function ele_reset_innerHTML(ele)
{
    if(ele != undefined)
    ele.innerHTML = '';
}

function ele_append_text(ele, text)
{
    if(ele != undefined)
    ele.innerHTML += text;
}

function ele_append_child(ele, child)
{
    if(ele != undefined && chile != undefined)
    div.appendChild(child);
}