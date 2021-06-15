// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Context Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.3.1
// @description  0.3.1 fix error
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// ==/UserScript==

/*
var JSON_language = document.documentElement.lang;

Edit this value manually if document.documentElement.lang not yet support your
language. Check the github directory to make sure the target file existed.
==> objective-helper/objective-helper.JSON_language.json

ex: A Wookiee language for Chewbacca is not yet support by AWS frontned, then
you can contribute content in file:objective-helper/objective-helper.Wookiee.json and set JSON_language = 'Wookiee'
*/
var JSON_language = document.documentElement.lang;

var supported_language = {
    "English": "en",
    "Bahasa Indonesia": "id",
    "한국어":"kr",
    "中文(繁體)": "zh_TW",
    "中文(简体)": "zh_CN"
};

/*
var arr_Click_Req = ['Click_Req','Grrrrrrr'];
By default you will use Click_Req, unless you really boring. Also if you want to append Click_Req element you will have to handle the CSP exception in your own browser.
*/
var arr_Click_Req = ['Click_Req'];

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/
var LOG_LEVEL = '';

/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_CONTENT = false; // for Object Helper JSON content
var OH_R_CONTENT_READY = false; // JSON content loaded
var OH_R_QUESTION_READY = false; // register flag for page load question ready
var OH_QUESTION_KEY = ''; // index for the current question like "OPS 1", "SEC 1"
var OH_QUESTION_KEY_CHANGED = false; // incase page fly
/***************************************/


/***************************************/
/*CONTEXT*/
var oh_div_context_helper = document.createElement('div');
    oh_div_context_helper.id = 'oh_div_context_helper'

var oh_div_context_helper_container = document.createElement('div'); //Div Container
    oh_div_context_helper_container.id = 'oh_div_context_helper_container';
    oh_div_context_helper_container.style.background = '#FFFFCC'; //Append bgcolor
    oh_div_context_helper_container.style.display = 'none';
    oh_div_context_helper_container.innerHTML = '';


var oh_div_context_helper_header = document.createElement('button');
    oh_div_context_helper_header.id = 'oh_div_context_helper_header';
    oh_div_context_helper_header.innerHTML = 'Context ▼';
    oh_div_context_helper_header.addEventListener("click", function() {
        var content = document.getElementById("oh_div_context_helper_container");
        var header = document.getElementById("oh_div_context_helper_header");
        if(content.style.display == 'none'){
            content.style.display = 'block';
            header.innerHTML = 'Context ▲';
        }
        else {
            content.style.display = 'none';
            header.innerHTML = 'Context ▼';
        }
    });

var oh_div_context_helper_language = document.createElement('select');
    oh_div_context_helper_language.id = 'oh_div_context_helper_language';

    for (const [key, value] of Object.entries(supported_language))
        {
            var opt = document.createElement("option");
            opt.text = key;
            opt.value = value;
            if(value == JSON_language) opt.selected = true;
            oh_div_context_helper_language.add(opt, null);
        }

    oh_div_context_helper_language.addEventListener("change", function() {
        var sel_lang = document.getElementById("oh_div_context_helper_language");
        //GM.setValue("WAFR_CONTEXT_HELPER_LANG", sel_lang.value);
        EXT_Get_Objective_Helper_JSON(sel_lang.value);
    });

    oh_div_context_helper.appendChild(oh_div_context_helper_header);
    oh_div_context_helper.appendChild(oh_div_context_helper_language);
    oh_div_context_helper.appendChild(oh_div_context_helper_container);


/***************************************/



/***************************************/
/* DOM Handling */
/* Mandatory function : OH_<Help-Module-Name>_Append_Div()

function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}
*/

function OH_Context_Helper_Append_Div(){
    DOM_Context_Helper_Container_flush(); //append the module content reset step
    oh_div_helper.appendChild(document.createElement("br"));
    oh_div_helper.appendChild(oh_div_context_helper); //append the div of module
}

/* Find the Question location and append a Div */
/* Append the objective content right after Question */
/* Check the JSON and load all the content into Container Div */
function DOM_Context_Helper_Append_Content() {
    if(OH_CONTENT == false) return;
    if(OH_QUESTION_KEY == false) return;
    if(OH_QUESTION_KEY_CHANGED == false) return;

    debug("Ready to refresh JSON content to div");
    var JSON_value;
    if(OH_CONTENT.hasOwnProperty(OH_QUESTION_KEY))
    {
        JSON_value = OH_CONTENT[OH_QUESTION_KEY]
        for (const [key, value] of Object.entries(JSON_value))
        {
            JSON_format_handler(key,value);
        }
        OH_QUESTION_KEY_CHANGED = false;
    }
}


function DOM_Context_Helper_append_text(text)
{
    oh_div_context_helper_container.innerHTML += text;
}
function DOM_Context_Helper_append_child(element) {
    oh_div_context_helper_container.appendChild(element);
}

function DOM_Identify_Current_Pillar_Question(){
    // Find and parse the Question Text, get the Questions key
    var has_help_button = document.getElementsByClassName("has-help-button");
    debug("has_help_button",has_help_button);
    if(has_help_button.length>0)
    {
        debug("has_help_button.length>0", has_help_button[0]);
        var key_index = has_help_button[0].innerHTML.search(/^\S+\s\d+/g);
        debug("key_index",key_index);
        if( key_index == 0)
        {
            var current_question_key = String(has_help_button[0].innerHTML.match(/^\S+\s\d+/g));
            debug("current_question_key",current_question_key);
            debug("OH_QUESTION_KEY",OH_QUESTION_KEY);
            if(current_question_key != OH_QUESTION_KEY)
            {
                OH_QUESTION_KEY = current_question_key;
                OH_QUESTION_KEY_CHANGED = true;
                DOM_Context_Helper_Container_flush();
                DOM_Context_Helper_Append_Content();
                debug("flush content");
            }
            else
            {
                OH_QUESTION_KEY_CHANGED = false;
            }
        }
        else
        {
            debug("retry in 3s");
            setTimeout(DOM_Identify_Current_Pillar_Question, 3000);
        }
    }
    else{
        debug("document.getElementsByClassName(has-help-button) failed");
        setTimeout(DOM_Identify_Current_Pillar_Question, 3000);
    }
}


function DOM_Context_Helper_Container_flush(){
    oh_div_context_helper_container.innerHTML = '';
}

function DOM_Context_Helper_Refresh_Check(){
    debug("DOM_Check_Helper_Existed-->",DOM_Check_Helper_Existed());
    if(DOM_Check_Helper_Existed() == true){
        DOM_Identify_Current_Pillar_Question();}
    //Append language change trigger here

    /*
    let p = new Promise(function (resolve, reject) {
            (function Wait_For_Helper_Existed(){
                if (DOM_Check_Helper_Existed()) return DOM_Identify_Current_Pillar_Question();
                setTimeout(Wait_For_Helper_Existed, 100);
            })();
    });
    */

}

/* JSON Data Handling */
/* Dispatch to different format handler here */
function JSON_format_handler(JSON_key, JSON_value){
    //Change the text convert as default setting
    //if(arr_Objective.includes(JSON_key)) return JSON_format_objective(JSON_key, JSON_value);

    if(arr_Click_Req.includes(JSON_key)) return JSON_format_click_req(JSON_key,JSON_value);
    if(JSON_key == 'HTTP_Req') return JSON_format_background_req(JSON_key, JSON_value);
    if(typeof(JSON_value) == 'object' && Array.isArray(JSON_value)) return JSON_format_text_list(JSON_key, JSON_value);

    return JSON_format_default(JSON_key, JSON_value)
}

/* Default, do nothing only +p */
function JSON_format_default(JSON_key, JSON_value){
    DOM_Context_Helper_append_text('<h2>' + JSON_key + '</h2>' + '<p>' + JSON_value + '</p><hr />');
}

/* convert text list with auto <br/> */
function JSON_format_text_list(JSON_key, JSON_value){
    debug("JSON_format_text_list");
    var JSON_value_text = '';
    JSON_value.forEach(append_to_text);
    function append_to_text(item, index){
        JSON_value_text += " - " + item + "<br />";
    }
    return JSON_format_default(JSON_key, JSON_value_text);
}


/* simple readability convert for our default format */
//function JSON_format_objective(JSON_key, JSON_value){
function JSON_format_newline_to_br(JSON_key, JSON_value){
    //if(JSON_value.search(/\s\*\s/g) > -1) JSON_value = JSON_value.replace(/\s\*\s/g,'<li>');
    if(JSON_value.search(/\\n/g) > -1) JSON_value = JSON_value.replace(/\\n/g,'<br />');
    return JSON_format_default(JSON_key, JSON_value);
}

/* To perform a background http request */
/* Disclaimer:::: Once you create a data key "HTTP_Req" in JSON file, greaseMonkey/TemperMoneky will pop-up a confirmation for you to grant the privilege for access remote host. Please understand this will send data from your session outo the remote host, and be careful about the data privacy and security. */
function JSON_format_background_req(JSON_key, JSON_value){
    JSON_HttpReq_Handler(JSON_value, debug);
    return "";
}

/* To create a element with an click event listner which will send out httpReq. This will require CSP override, please make sure your CSP overrided on your browser. Disclaimer:::: Please make sure you understand if you override your CSP, your browser will be able to create remote communication. Please understand this will send data from your session outo the remote host, and be careful about the data privacy and security. */
function JSON_format_click_req(JSON_key, JSON_value){
    var httpPayload = JSON_value['HTTP_Req'];
    var j = document.createElement("a");
    j.textContent = JSON_value['text'];
    j.href = "javascript:void(0);";
    j.addEventListener("click", function(ev) {
        var httpRequest;
        httpRequest = new XMLHttpRequest();
        httpRequest.open(httpPayload['method'], httpPayload['url'], true);
        httpRequest.send(httpPayload['data']);
    }, false);
    DOM_Context_Helper_append_text(JSON_key+"<br>");
    DOM_Context_Helper_append_child(j);
}

/* HTTP Request Handler */
function JSON_HttpReq_Handler(JSON_value, callback){
    var GM_payload = {
        method: '',
        url: '',
        data: '',
        headers: '',
        onload: function(response) {
            debug(response.responseText);
            callback(response);
        }
    };
    for (const [key, value] of Object.entries(JSON_value))
    {
        GM_payload[key] = value;
    }
    GM.xmlHttpRequest(GM_payload);
}

/* Fetch the JSON file by language from github */
function EXT_Get_Objective_Helper_JSON(...args){
    //if(OH_R_CONTENT_READY) return;

    var lang = JSON_language;
    if(args.length == 1) lang = args[0];

    try{
        debug("lang",lang);
        console.log(OH_CONTENT);
        OH_QUESTION_KEY = "";
        OH_QUESTION_KEY_CHANGED = true;
        var url = "https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/objective-helper/objective-helper." + lang + ".json";
        debug("url",url);
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    OH_CONTENT = JSON.parse(response.responseText);

                    if(OH_CONTENT === undefined)
                    {
                         debug('Unable to load the Objective Helper JSON, Please feed your monkey with proper privilege.');
                         JSON_language = 'en';
                         setTimeout(EXT_Get_Objective_Helper_JSON,3000);
                    }
                    else
                    {
                        OH_R_CONTENT_READY = true;
                        DOM_Context_Helper_Refresh_Check();
                        JSON_language = lang;
                        debug("EXT_Get_Objective_Helper_JSON ready");
                    }
                }
                catch(err) {
                    OH_R_CONTENT_READY = false;
                    debug(err.message);
                    JSON_language = 'en';
                    setTimeout(EXT_Get_Objective_Helper_JSON,3000);
                }
            }
        });

    }
    catch(err) {
        debug(err.message);
    }
}

function debug(...args){
    /* Oh, I deleted all the debug calling */
    if(LOG_LEVEL == 'debug') {
        for (let i=0; i<args.length; i++) console.log("----> " + args[i]);}
}


/*
Mandatory function OH_<Help-Module-Name>_reload()
function OH_Context_Helper_reload() {
*/
function OH_Context_Helper_reload()
{
    DOM_Context_Helper_Refresh_Check();
}

/*
Mandatory function OH_<Help-Module-Name>_init()
function OH_Context_Helper_init() {
    // Main entry point for the scripts
    // All the step which need to load once at initial time.
*/

function OH_Context_Helper_init() {
    /* Main entry point for the scripts */
    EXT_Get_Objective_Helper_JSON();
    DOM_Context_Helper_Refresh_Check();
}