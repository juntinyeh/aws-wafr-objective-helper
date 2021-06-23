// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Context Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.4.4
// @description  0.4.4 disable JSON cache
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @grant        GM.deleteValue
// @run-at       document-end
// ==/UserScript==


/*
var JSON_CUSTOMIZED = "https://somewhere-you-place-your-json-file"

This variable will have highest priority, if customized location been set, by default the context helper will only load this target file.

For clear layout, we suggest you to set JSON_MULTI_LANG_ENABLE = false; at the same time.
*/
var JSON_CUSTOMIZED = "";

/*
==> objective-helper/objective-helper.$JSON_LANG.json
ex: JSON_LANG = "vn";
==> objective-helper/objective-helper.vn.json
*/
//var JSON_LANG = document.documentElement.lang; //variable deprecred


var JSON_LANG_DEFAULT = "en";
var JSON_BASE_DIR = "https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/objective-helper/";
var JSON_FILE_PREFIX = "objective-helper."; 
var JSON_FILE_POSTFIX = ".json"
/*
Context helper will download the remote JSON file with location setting: 
==> JSON_BASE_DIR + JSON_FILE_PREFIX + $JSON_LANG + JSON_POST_FIX
The default location will be 
"https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/objective-helper/objective-helper." + $JSON_LANG + ".json";

If you want to use one dedicated customized JSON file, without language option, 
set the JSON_MULTI_LANG_ENABLE = false; 
the JSON file location will be 
==> JSON_BASE_DIR + JSON_FILE_PREFIX + JSON_POST_FIX
*/

var JSON_MULTI_LANG_ENABLE = true;
var JSON_SUPPORTED_LANG = {
    "": JSON_LANG_DEFAULT,
    "English": "en",
    "Bahasa Indonesia": "id",
    "한국어":"ko",
    "中文(繁體)": "zh_TW",
    "中文(简体)": "zh_CN"
};

/*
By default you will use Click_Req, unless you really boring. Also if you want to append Click_Req element you will have to handle the CSP exception in your own browser. Or click the exception handling in GreaseMonkey settings.
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
var OH_QUESTION_KEY = ''; //index for the current question like "OPS 1", "SEC 1"
var OH_QUESTION_KEY_CHANGED = false; // incase page fly
/***************************************/


/***************************************/
/*CONTEXT*/
var oh_div_context_helper = document.createElement('div');
    oh_div_context_helper.id = 'oh_div_context_helper'
    oh_div_context_helper.className = 'awsui-util-container-header';


var oh_div_context_helper_container = document.createElement('div'); //Div Container
    oh_div_context_helper_container.id = 'oh_div_context_helper_container';
    oh_div_context_helper_container.className = 'awsui-util-container-header';
    oh_div_context_helper_container.style.display = 'none';
    oh_div_context_helper_container.innerHTML = '';


var oh_div_context_helper_header = document.createElement('button');
    oh_div_context_helper_header.id = 'oh_div_context_helper_header';
    oh_div_context_helper_header.className = "awsui-button awsui-button-variant-primary";
    oh_div_context_helper_header.innerHTML = 'Context ▼';
    oh_div_context_helper_header.style = 'text-align:center; width:160px';
    oh_div_context_helper_header.style.width = '160px';
    oh_div_context_helper_header.addEventListener("click", function() {        
        div_ani_click_toggle('oh_div_context_helper_header','oh_div_context_helper_container', 'Context ');
        DOM_Context_Helper_Refresh_Check();
    });

var oh_div_context_helper_language = document.createElement('select');
    oh_div_context_helper_language.id = 'oh_div_context_helper_language';

    for (const [key, value] of Object.entries(JSON_SUPPORTED_LANG))
        {
            var opt = document.createElement("option");
            opt.text = key;
            opt.value = value;
            oh_div_context_helper_language.add(opt, null);
        }

    oh_div_context_helper_language.addEventListener("change", function() {
        var sel_lang = document.getElementById("oh_div_context_helper_language");
        EXT_Get_Objective_Helper_JSON(sel_lang.value);
        div_ani_click_expend('oh_div_context_helper_header','oh_div_context_helper_container', 'Context ');
    });

var oh_div_context_helper_reload = document.createElement('a');
    oh_div_context_helper_reload.id = "oh_div_context_helper_reload";
    oh_div_context_helper_reload.innerHTML = '<p>clear cache</p>';
    oh_div_context_helper_reload.addEventListener("click", function(){
        JSON_clear_cache();
    })

    oh_div_context_helper.appendChild(oh_div_context_helper_header);
    oh_div_context_helper.innerHTML += '&nbsp;';
    oh_div_context_helper.appendChild(oh_div_context_helper_language);
    //oh_div_context_helper.appendChild(oh_div_context_helper_reload);
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
    //oh_div_helper.appendChild(document.createElement("br"));
    //oh_div_helper.appendChild(oh_div_context_helper); //append the div of module
    return oh_div_context_helper;
}

/* Find the Question location and append a Div */
/* Append the objective content right after Question */
/* Check the JSON and load all the content into Container Div */
function DOM_Context_Helper_Append_Content() {
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

function DOM_Identify_Current_Pillar_Question(){
    // Find and parse the Question Text, get the Questions key
    /*var has_help_button = document.getElementsByClassName("has-help-button");
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
                DOM_Context_Helper_Container_flush();
                DOM_Context_Helper_Append_Content();
            }
            else
            {
                OH_QUESTION_KEY_CHANGED = false;
            }
        }
        else
        {
            setTimeout(DOM_Identify_Current_Pillar_Question, 3000);
        }
    }
    else{
        setTimeout(DOM_Identify_Current_Pillar_Question, 3000);
    }*/
    var current_question_key = OH_Get_Question_Ref();
    if(current_question_key != OH_QUESTION_KEY)
    {
        OH_QUESTION_KEY = current_question_key;
        OH_QUESTION_KEY_CHANGED = true;
        DOM_Context_Helper_Container_flush();
        DOM_Context_Helper_Append_Content();
    }
    else
    {
        OH_QUESTION_KEY_CHANGED = false;
    }
}


function DOM_Context_Helper_Container_flush(){
    oh_div_context_helper_container.innerHTML = '';
}

function DOM_Context_Helper_Refresh_Check(){
    var objs = document.getElementById("oh_div_helper");
    if(!(objs===null)){
        DOM_Identify_Current_Pillar_Question();}
    else{
        console.log("oh_div_helper not existed!");
        setTimeout(DOM_Context_Helper_Refresh_Check,5000);
    }
}

/* JSON Data Handling */
/* Dispatch to different format handler here */
function JSON_get_url(lang)
{
    var JSON_url = JSON_BASE_DIR + JSON_FILE_PREFIX;
    if(JSON_MULTI_LANG_ENABLE)
        JSON_url += lang;
    JSON_url += JSON_FILE_POSTFIX;

    if(JSON_CUSTOMIZED!="") return JSON_CUSTOMIZED;
    return JSON_url;
}

function JSON_format_handler(JSON_key, JSON_value){
    //Change the text convert as default setting    
    if(arr_Click_Req.includes(JSON_key)) return JSON_format_click_req(JSON_key,JSON_value);
    if(JSON_key == 'HTTP_Req') return JSON_format_background_req(JSON_key, JSON_value);
    if(typeof(JSON_value) == 'object' && Array.isArray(JSON_value)) return JSON_format_text_list(JSON_key, JSON_value);

    return JSON_format_default(JSON_key, JSON_value)
}

/* Default, do nothing only +p */
function JSON_format_default(JSON_key, JSON_value){
    div_append_text('oh_div_context_helper_container',div_format_key_value_to_text(JSON_key, JSON_value));
}

/* convert text list with auto <br/> */
function JSON_format_text_list(JSON_key, JSON_value){
    JSON_format_default(JSON_key,div_format_value_list_to_text(JSON_value));
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
    div_append_text('oh_div_context_helper_container',JSON_key+"<br>");
    div_append_child('oh_div_context_helper_container',j);
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

/*
 By input language, check if target JSON already been downloaded. Use GM.setValue & GM.getValue to enable the cache mechanism. 
*/
function EXT_Get_Objective_Helper_JSON(...args){
    //if(OH_R_CONTENT_READY) return;
    var lang;
    if(args.length == 1) lang = args[0];
    else return false;
    if(lang == "") return false; // or lang not in supported language

    var url = JSON_get_url(lang);
  
    (async () => {
        var cached_json = await GM.getValue(url, -1);
  
        if(cached_json == -1)
        {
            console.log("No cached value, fetch remote:", url);
            try{
                OH_QUESTION_KEY = "";
                OH_QUESTION_KEY_CHANGED = true;        
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        try {                    
                            OH_CONTENT = JSON.parse(response.responseText);
                            
                            OH_R_CONTENT_READY = true;
                            //GM.setValue(url, OH_CONTENT);
                            DOM_Context_Helper_Refresh_Check();
                                                    
                        }
                        catch(err) {
                            OH_R_CONTENT_READY = false;
                            console.log(err.message);
                        }
                    }
                });

            }
            catch(err) {
                console.log(err.message);
            }
        }
        else
        {
            OH_CONTENT = cached_json;
            DOM_Context_Helper_Refresh_Check();
            console.log("Target JSON existed, use cached --> ",url);
        }
    })();
}


function JSON_clear_cache()
{
    (async () => {
        let keys = await GM.listValues();
        for (let key of keys) {
            if(key.indexOf("https://") == 0)
            {
                GM.deleteValue(key);
                console.log("Clear cached JSON:", key);

            }
        }
        alert("Cache JSON cleared");
    })();

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
    EXT_Get_Objective_Helper_JSON(JSON_LANG_DEFAULT);
    DOM_Context_Helper_Refresh_Check();
}