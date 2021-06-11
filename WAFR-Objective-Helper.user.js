// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  To append useful message for WAFR host.
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
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
/***************************************/


/***************************************/
/*CONTEXT*/


var oh_div_helper_container = document.createElement('div'); //Div Container
    oh_div_helper_container.id = 'oh_div_helper_container';
    oh_div_helper_container.style.background = '#FFFFCC'; //Append bgcolor
    oh_div_helper_container.style.display = 'none';
    oh_div_helper_container.innerHTML = '';


var oh_div_helper_header = document.createElement('button');
    oh_div_helper_header.id = 'oh_div_helper_header';
    oh_div_helper_header.innerHTML = 'Context ▼';
    oh_div_helper_header.addEventListener("click", function() {
        var content = document.getElementById("oh_div_helper_container");
        var header = document.getElementById("oh_div_helper_header");
        if(content.style.display == 'none'){
            content.style.display = 'block';
            header.innerHTML = 'Context ▲';
        }
        else {
            content.style.display = 'none';
            header.innerHTML = 'Context ▼';
        }
    });


var oh_div_helper = document.createElement('div');
    oh_div_helper.appendChild(oh_div_helper_header);
    oh_div_helper.appendChild(oh_div_helper_container);


/***************************************/


/***************************************/
/*FOLLOW UP*/

var oh_followup_display_container = document.createElement('div'); //Div Container
    oh_followup_display_container.id = 'oh_followup_display_container';
    oh_followup_display_container.style.background = '#FFFFCC'; //Append bgcolor
    oh_followup_display_container.style.display = 'block';
    oh_followup_display_container.innerHTML = '';

var oh_list_button = document.createElement('button');
    oh_list_button.id = 'oh_list_button';
    oh_list_button.innerHTML = '&nbsp&nbspLIST&nbsp&nbsp';
    //oh_list_button.style = 'cursor: pointer; border: 1px solid blue;';
    oh_list_button.addEventListener("click", function() {
        var content = document.getElementById("oh_followup_display_container");
        var GM_payload = {
            method: 'GET',
            url: 'https://.execute-api.ap-southeast-2.amazonaws.com/Prod/list/',
            data: '',
            headers: '',
            onload: function(response) {
                content.innerHTML = response.responseText;
            }
        };
        GM.xmlHttpRequest(GM_payload);
    });


var oh_add_button = document.createElement('button');
    oh_add_button.id = 'oh_add_button';
    oh_add_button.innerHTML = '&nbsp&nbspNEW&nbsp&nbsp';
    //oh_add_button.style = 'cursor: pointer; border: 1px solid blue;';
    oh_add_button.addEventListener("click", function() {
        var content = document.getElementById("oh_followup_display_container");
        var GM_payload = {
            method: 'POST',
            url: 'https://.execute-api.ap-southeast-2.amazonaws.com/Prod/add/',
            data: '',
            headers: '',
            onload: function(response) {
                content.innerHTML = '';
                content.appendChild(oh_new_followup_form_container);
            }
        };
        GM.xmlHttpRequest(GM_payload);
    });



var oh_followup_buttons = document.createElement('div'); //Div Container
    oh_followup_buttons.id = 'oh_followup_buttons';
    oh_followup_buttons.style.display = 'none';
    oh_followup_buttons.appendChild(document.createElement("br"));
    oh_followup_buttons.appendChild(oh_list_button);
    oh_followup_buttons.appendChild(document.createTextNode("\u00A0\u00A0"));
    oh_followup_buttons.appendChild(oh_add_button);
//    oh_followup_buttons.appendChild(document.createElement("hr"));


var oh_followup_div_helper_header = document.createElement('button');
    oh_followup_div_helper_header.id = 'oh_followup_div_helper_header';
    oh_followup_div_helper_header.innerHTML = 'Follow-up ▼';
    oh_followup_div_helper_header.addEventListener("click", function() {
        var button = document.getElementById("oh_followup_buttons");
        var content = document.getElementById("oh_followup_display_container");
        var header = document.getElementById("oh_followup_div_helper_header");
        if(content.style.display == 'none'){
            content.style.display = 'block';
            button.style.display = 'block';
            header.innerHTML = 'Follow-up ▲';
        }
        else {
            content.style.display = 'none';
            button.style.display = 'none';
            header.innerHTML = 'Follow-up ▼';
        }
    });

var oh_followup_div_helper = document.createElement('div');
    oh_followup_div_helper.appendChild(oh_followup_div_helper_header);
    oh_followup_div_helper.appendChild(oh_followup_buttons);
    oh_followup_div_helper.appendChild(oh_followup_display_container);

/***************************************/


/***************************************/
/*FOLLOW UP - NEW Form*/

var oh_new_followup_form_submit = document.createElement('button');
    oh_new_followup_form_submit.id = 'oh_new_followup_form_submit';
    oh_new_followup_form_submit.innerHTML = '&nbsp&nbspSUBMIT&nbsp&nbsp';
    oh_new_followup_form_submit.addEventListener("click", function() {
        var content = document.getElementById("oh_followup_display_container");
        var GM_payload = {
            method: 'GET',
            url: 'https://.execute-api.ap-southeast-2.amazonaws.com/Prod/list/',
            data: '',
            headers: '',
            onload: function(response) {
                console.log("Submitted");
            }
        };
        GM.xmlHttpRequest(GM_payload);
    });

var oh_new_followup_deepdive_type = document.createElement('option');
    oh_new_followup_deepdive_type.text = 'Deep dive';
    oh_new_followup_deepdive_type.id = 'oh_new_followup_deepdive_type';

var oh_new_followup_general_type = document.createElement('option');
    oh_new_followup_general_type.text = 'General';
    oh_new_followup_general_type.id = 'oh_new_followup_general_type';

var oh_new_followup_type_select = document.createElement("select");
    oh_new_followup_type_select.id = 'oh_new_followup_form_type_select';
    oh_new_followup_type_select.appendChild(oh_new_followup_deepdive_type);
    oh_new_followup_type_select.appendChild(oh_new_followup_general_type);

var oh_new_followup_type_label = document.createElement('label');
    oh_new_followup_type_label.id = 'oh_new_followup_type_label';
    oh_new_followup_type_label.innerHTML = 'Followup type :';

var oh_new_followup_note_field = document.createElement('textarea');
    oh_new_followup_note_field.maxLength = "5000";
    oh_new_followup_note_field.cols = "80";
    oh_new_followup_note_field.rows = "5";
    oh_new_followup_note_field.id = 'oh_new_followup_note_field';

var oh_new_followup_contact_field = document.createElement('input');
    oh_new_followup_contact_field.setAttribute('type', 'text');
    oh_new_followup_contact_field.id = 'oh_new_followup_contact_field';

var oh_new_followup_note_label = document.createElement('label');
    oh_new_followup_note_label.id = 'oh_new_followup_note_label';
    oh_new_followup_note_label.innerHTML = 'Note :';

var oh_new_followup_contact_label = document.createElement('label');
    oh_new_followup_contact_label.id = 'oh_new_followup_contact_label';
    oh_new_followup_contact_label.innerHTML = 'Contact :';

var oh_new_followup_form_table ;
    oh_new_followup_form_table = document.createElement('table');

//Type Cell
var oh_new_followup_form_row_0 = oh_new_followup_form_table.insertRow(0);
var oh_new_followup_form_cell_0_0 = oh_new_followup_form_row_0.insertCell(0);
    oh_new_followup_form_cell_0_0.appendChild(oh_new_followup_type_label);
var oh_new_followup_form_cell_0_1 = oh_new_followup_form_row_0.insertCell(1);
    oh_new_followup_form_cell_0_1.appendChild(oh_new_followup_type_select);

//NOTE Cell
var oh_new_followup_form_row_1 = oh_new_followup_form_table.insertRow(1);
var oh_new_followup_form_cell_1_0 = oh_new_followup_form_row_1.insertCell(0);
    oh_new_followup_form_cell_1_0.appendChild(oh_new_followup_note_label);
var oh_new_followup_form_cell_1_1 = oh_new_followup_form_row_1.insertCell(1);
    oh_new_followup_form_cell_1_1.appendChild(oh_new_followup_note_field);

//Contact Cell
var oh_new_followup_form_row_2 = oh_new_followup_form_table.insertRow(2);
var oh_new_followup_form_cell_2_0 = oh_new_followup_form_row_2.insertCell(0);
    oh_new_followup_form_cell_2_0.appendChild(oh_new_followup_contact_label);
var oh_new_followup_form_cell_2_1 = oh_new_followup_form_row_2.insertCell(1);
    oh_new_followup_form_cell_2_1.appendChild(oh_new_followup_contact_field);

    oh_new_followup_form_table.id = 'oh_new_followup_form_table';

var oh_new_followup_form_container = document.createElement('div'); //Div Container
    oh_new_followup_form_container.id = 'oh_followup_display_container';
    oh_new_followup_form_container.style.background = '#e6ffe6'; //Append bgcolor
    oh_new_followup_form_container.style.display = 'block';
    oh_new_followup_form_container.appendChild(document.createElement("br"));
    oh_new_followup_form_container.appendChild(oh_new_followup_form_table);
    oh_new_followup_form_container.appendChild(document.createElement("br"));
    oh_new_followup_form_container.appendChild(oh_new_followup_form_submit);

/***************************************/


/***************************************/
/*Conformance*/

var oh_conformance_display_container = document.createElement('div'); //Div Container
    oh_conformance_display_container.id = 'oh_conformance_display_container';
    oh_conformance_display_container.style.background = '#A9FFEB'; //Append bgcolor
    oh_conformance_display_container.style.display = 'block';
    oh_conformance_display_container.innerHTML = '';

var oh_check_button = document.createElement('button');
    oh_check_button.id = 'oh_check_button';
    oh_check_button.innerHTML = 'CHECK';
    oh_check_button.addEventListener("click", function() {
        var content = document.getElementById("oh_conformance_display_container");
        var GM_payload = {
            method: 'GET',
            url: 'https://7oj9c9aikg.execute-api.ap-southeast-2.amazonaws.com/Prod/list/',
            data: '',
            headers: '',
            onload: function(response) {
                content.innerHTML = response.responseText;
            }
        };
        GM.xmlHttpRequest(GM_payload);
    });

var oh_conformance_buttons = document.createElement('div'); //Div Container
    oh_conformance_buttons.id = 'oh_conformance_buttons';
    oh_conformance_buttons.style.display = 'none';
    oh_conformance_buttons.appendChild(document.createElement("br"));
    oh_conformance_buttons.appendChild(oh_check_button);
    oh_conformance_buttons.appendChild(document.createElement("hr"));
    //oh_conformance_buttons.style.background = '#FFFFCC'; //Append bgcolor

var oh_conformance_div_helper_header = document.createElement('button');
    oh_conformance_div_helper_header.id = 'oh_conformance_div_helper_header';
    oh_conformance_div_helper_header.innerHTML = 'Conformance ▼';
    oh_conformance_div_helper_header.addEventListener("click", function() {
        var button = document.getElementById("oh_conformance_buttons");
        console.log(button);
        var content = document.getElementById("oh_conformance_display_container");
        var header = document.getElementById("oh_conformance_div_helper_header");
        if(content.style.display == 'none'){
            content.style.display = 'block';
            button.style.display = 'block';
            header.innerHTML = 'Conformance ▲';
        }
        else {
            content.style.display = 'none';
            button.style.display = 'none';
            header.innerHTML = 'Conformance ▼';
        }
    });

var oh_conformance_div_helper = document.createElement('div');
    oh_conformance_div_helper.appendChild(oh_conformance_div_helper_header);
    oh_conformance_div_helper.appendChild(oh_conformance_buttons);
    oh_conformance_div_helper.appendChild(oh_conformance_display_container);



/***************************************/

/***************************************/
/* DOM Handling */
/* Find the Question location and append a Div */
/* Append the objective content right after Question */
function DOM_Append_Helper_Container_Div() {
    if(OH_R_CONTAINER_DIV_READY) return;

    var objs = document.getElementsByClassName("awsui-form-field awsui-form-field-stretch");
    DOM_Container_flush();
    objs[0].appendChild(document.createElement("br"));
    objs[0].appendChild(oh_div_helper);
    objs[0].appendChild(document.createElement("br"));
    objs[0].appendChild(oh_followup_div_helper);
    objs[0].appendChild(document.createElement("br"));
    objs[0].appendChild(oh_conformance_div_helper);
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
    DOM_Container_append_text('<h2>' + JSON_key + '</h2>' + '<p>' + JSON_value + '</p><hr />');
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
            console.log(response.responseText);
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
        url: "https://raw.githubusercontent.com/stephensalim/aws-wafr-objective-helper/main/objective-helper/objective-helper." + JSON_language + ".json",
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
    setInterval(DOM_Refresh_Check, 3000);
}

OH_bootstrap();