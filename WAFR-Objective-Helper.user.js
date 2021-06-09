// ==UserScript==
// @name         (AWS WAFR OH!) Amazon Web Services Well-Architected Framework Review Objective Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  To append useful message for WAFR host. 
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:)
// @match        https://console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
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

/*
var arr_Objective = ['Objective','Uhrrr'];
Append the translation of the Objective in your own language here, which we created a simple layout readability handler for ' * ' and '\n'.
var arr_Objective = ['Objective'];

v0.1.2 Disable this setting from v0.1.2, simplify the code logic. Change the readability to default text handling, in case we have different language and key/value combination coming in. 
*/

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
var OH_R_CONTAINER_DIV_READY = false; // register flag for container div ready
var OH_QUESTION_KEY = ''; // index for the current question like "OPS 1", "SEC 1" 
var OH_QUESTION_KEY_CHANGED = false; // incase page fly
var oh_div_helper_container = document.createElement('div'); //Div Container
    oh_div_helper_container.id = 'oh_div_helper_container';
    oh_div_helper_container.style.background = '#FFFFCC'; //Append bgcolor
    oh_div_helper_container.innerHTML = '';
/***************************************/


/* DOM Handling */
/* Find the Question location and append a Div */
/* Append the objective content right after Question */
function DOM_Append_Helper_Container_Div() {
    if(OH_R_CONTAINER_DIV_READY) return;

    var objs = document.getElementsByClassName("awsui-util-action-stripe");    
    DOM_Container_flush();
    objs[0].appendChild(oh_div_helper_container);
    OH_R_CONTAINER_DIV_READY = true;
}

function DOM_Check_Container_Div_Existed() {
    var objs = document.getElementById(oh_div_helper_container.id);
    if(objs === null){
        OH_R_CONTAINER_DIV_READY = false;
    }
    return OH_R_CONTAINER_DIV_READY; 
}

/* Check the JSON and load all the content into Container Div */
function DOM_Append_Helper_Content() {
    if(OH_CONTENT == false) return;
    if(OH_QUESTION_KEY == false) return;
    if(OH_QUESTION_KEY_CHANGED == false) return;

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

function DOM_Container_flush()
{
    oh_div_helper_container.innerHTML = '';   
}

    
function DOM_Container_append_text(text)
{
    oh_div_helper_container.innerHTML += text;
}
function DOM_Container_append_child(element) {
    oh_div_helper_container.appendChild(element);
}

function DOM_Identify_Current_Pillar_Question(){

    /* Find and parse the Question Text, get the Questions key */
    var has_help_button = document.getElementsByClassName("has-help-button");
    if(has_help_button.length>0)
    {
        var key_index = has_help_button[0].innerHTML.search(/^\S+\s\d+/g);
        if( key_index == 0)
        {
            var current_question_key = String(has_help_button[0].innerHTML.match(/^\S+\s\d+/g));
            if(current_question_key != OH_QUESTION_KEY)
            {
                OH_QUESTION_KEY = current_question_key;
                OH_QUESTION_KEY_CHANGED = true;
                DOM_Container_flush();
                DOM_Append_Helper_Content();
            }
            else
            {
                OH_QUESTION_KEY_CHANGED = false;
            }
        }
    }
}

function DOM_Refresh_Check(){
    if(DOM_Check_Container_Div_Existed() == false) DOM_Append_Helper_Container_Div();
    if(DOM_Check_Container_Div_Existed() == true) DOM_Identify_Current_Pillar_Question();
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
    DOM_Container_append_text(JSON_key + '<p>' + JSON_value + '</p><hr />');
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
    DOM_Container_append_text(JSON_key+"<br>");
    DOM_Container_append_child(j);
}

/* HTTP Request Handler */
function JSON_HttpReq_Handler(JSON_value, callback){
    var GM_payload = {
        method: '',
        url: '',
        data: '',
        headers: '',
        onload: function(response) {
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
function EXT_Get_Objective_Helper_JSON(){
    if(OH_R_CONTENT_READY) return;
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/objective-helper/objective-helper." + JSON_language + ".json",
        onload: function(response) {
            try {
                OH_CONTENT = JSON.parse(response.responseText);
                if(OH_CONTENT === undefined)
                {
                    console.log('Unable to load the Objective Helper JSON, Please feed your monkey with proper privilege.');
                    JSON_language = 'en';
                    setTimeout(EXT_Get_Objective_Helper_JSON,1000);
                }
                else
                {
                    OH_R_CONTENT_READY = true;
                    setTimeout(DOM_Refresh_Check,3000);
                }
            }
            catch(err) {
                OH_R_CONTENT_READY = false;
                console.log(err.message);
                JSON_language = 'en';
                setTimeout(EXT_Get_Objective_Helper_JSON,1000);
            }
        }
    });
}

function debug(msg){
    /* Oh, I deleted all the debug calling */
    if(LOG_LEVEL === 'debug') {console.log("DEBUG>"+Date.now()+" ->" + msg);}
}

function OH_bootstrap() {
    /* Main entry point for the scripts */
    EXT_Get_Objective_Helper_JSON();
    setInterval(DOM_Refresh_Check, 5000);
}

OH_bootstrap();