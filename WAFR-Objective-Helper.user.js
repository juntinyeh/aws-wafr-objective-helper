// ==UserScript==
// @name         (AWS WAFR OH!) Amazon Web Services Well-Architected Framework Review Objective Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  To append useful message for WAFR host. 
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:)
// @match        https://console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==

var JSON_language = document.documentElement.lang; 
/* 
Edit this value manually if document.documentElement.lang not yet support your 
language. Check the github directory to make sure the target file existed.
==> objective-helper/objective-helper.JSON_language.json

ex: A Wookiee language for Chewbacca is not yet support by AWS frontned, then
you can contribute content in file:objective-helper/objective-helper.Wookiee.json
and set JSON_language = 'Wookiee' 
*/

/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var LOG_LEVEL = ''; //set debug if you want to try something new.
var OH_CONTENT; // for Object Helper JSON content
var OH_R_QUESTION_READY = false; // register flag for page load question ready
var OH_R_OBJECTIVE_READY = false; // register flag for objective div ready
var OH_QUESTION_KEY = ''; // index for the current question like "OPS 1", "SEC 1" 
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */

function DOM_AppendOHEntryButton() {
    if(OH_R_OBJECTIVE_READY) return;

    /* Append the objective content right after Question */
    var objs = document.getElementsByClassName("awsui-util-action-stripe");
    var oh_div_helper_container = document.createElement('div');
    oh_div_helper_container.id = 'oh_div_helper_container';
    oh_div_helper_container.innerHTML = '';
    if(OH_CONTENT.hasOwnProperty(OH_QUESTION_KEY))
    {
        for (const [key, value] of Object.entries(OH_CONTENT[OH_QUESTION_KEY])) 
        {
            oh_div_helper_container.innerHTML += key + '<p>' + value + '</p><hr/>';
        }
    }
    objs[0].appendChild(oh_div_helper_container);

    OH_R_OBJECTIVE_READY = true;
}

function DOM_IdentifyCurrentPillarQuestion(){
    if(OH_R_QUESTION_READY) return;

    /* Find and parse the Question Text, get the Questions key */
    var has_help_button = document.getElementsByClassName("has-help-button");
    if(has_help_button.length>0)
    {
        var key_index = has_help_button[0].innerHTML.search(/^\S+\s\d/g);
        if( key_index == 0)
        {
            OH_QUESTION_KEY = has_help_button[0].innerHTML.match(/^\S+\s\d/g);
            OH_R_QUESTION_READY = true;
        }
    }
}

function EXT_GetObjHelperJSON(){
    GM.xmlHttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/master/objective-helper/objective-helper.en.json",
        onload: function(response) {
            OH_CONTENT = JSON.parse(response.responseText);
            if(OH_CONTENT === undefined)
            {
                console.log('Unable to load the Objective Helper JSON, Please feed your monkey with proper privilege.');
                JSON_language = 'en';
                setTimeout(EXT_GetObjHelperJSON,5000);
            }
            else
            {
                setTimeout(DOM_IdentifyCurrentPillarQuestion,6000);
                setTimeout(DOM_AppendOHEntryButton,7000);
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

    /* Fetch the JSON from Github, now the github URL is fixed with en LANG. 
       Will extend to multi language later */
    EXT_GetObjHelperJSON();
}

OH_bootstrap();