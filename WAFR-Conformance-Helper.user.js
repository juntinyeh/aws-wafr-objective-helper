// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Conformance Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.3.0
// @description  Change the codebase for conformance-helper. Do not access oh_div_helper any more, which will violate the context scope in FireFox. Change to return div and handled the frontend merge in Review Helper.
// @author       teratim@amazon.com (github:)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @run-at       document-end
// ==/UserScript==

/*
var JSON_language = document.documentElement.lang;
//remvoed from conformance module, keep it here for ref.
*/

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/
var LOG_LEVEL = '';

var OH_CONFORMANCE_APIGW = 'https://r8s81n58dg.execute-api.ap-southeast-2.amazonaws.com/dev/monkey/getNonComplianceByQuestionRef';

/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_R_CONTAINER_DIV_READY = false;
// common register flag for checking container div ready, and any new separated module will have append the frontend DOM into this div 'oh_div_helper_container'
/***************************************/


/***************************************/
/*Conformance*/

var oh_conformance_display_container = document.createElement('div'); //Div Container
    oh_conformance_display_container.id = 'oh_conformance_display_container';
    oh_conformance_display_container.style.display = 'block';
    oh_conformance_display_container.innerHTML = '';


var oh_check_button = document.createElement('button');
    oh_check_button.id = 'oh_check_button';
    oh_check_button.className = "awsui-button awsui-button-variant-primary";
    oh_check_button.innerHTML = 'Conformance Check';
    oh_check_button.addEventListener("click", function() {
        console.log("click");
        OH_Conformance_Get_Noncompliant();
        //OH_Conformance_Helper_toggle();
    });

var oh_conformance_buttons = document.createElement('div'); //Div Container
    oh_conformance_buttons.id = 'oh_conformance_buttons';
    oh_conformance_buttons.style.display = 'none';
    //oh_conformance_buttons.appendChild(document.createElement("br"));
    //oh_conformance_buttons.appendChild(oh_check_button);
    oh_conformance_buttons.appendChild(document.createElement("hr"));

var oh_conformance_div_helper_header = document.createElement('button');
    oh_conformance_div_helper_header.className = "awsui-button awsui-button-variant-primary";
    oh_conformance_div_helper_header.id = 'oh_conformance_div_helper_header';
    oh_conformance_div_helper_header.innerHTML = '▼';
    oh_conformance_div_helper_header.addEventListener("click", function() {
        //var button = document.getElementById("oh_conformance_buttons");
        OH_Conformance_Helper_toggle();
    });


var oh_conformance_div_helper = document.createElement('div');
    oh_conformance_div_helper.className = 'awsui-util-container-header';
    oh_conformance_div_helper.appendChild(oh_check_button);
    oh_conformance_div_helper.appendChild(oh_conformance_div_helper_header);
    //oh_conformance_div_helper.appendChild(oh_conformance_buttons);
    oh_conformance_div_helper.appendChild(oh_conformance_display_container);



/***************************************/
/* Mandatory function : OH_<Help-Module-Name>_Append_Div()

function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}
*/
function OH_Conformance_Helper_Append_Div(){
    return oh_conformance_div_helper;
}


function OH_Conformance_Get_Noncompliant()
{
    console.log("OH_Conformance_Get_Noncompliant");
    var QuestionRef = OH_Get_Question_Ref();
    console.log(QuestionRef);
    var data = JSON.stringify({"questionRef":QuestionRef});
    console.log(data);
    var url = OH_CONFORMANCE_APIGW;
    var content = document.getElementById("oh_conformance_display_container");
    var GM_payload = {
        method: 'POST',
        url: url,
        data: data,
        headers: {"Content-Type":"application/json"},
        onload: function(response) {
            console.log("on load", url, response);
            try{
                var res = JSON.parse(response.responseText);
                console.log(res);

                document.getElementById("oh_conformance_display_container").innerHTML = "- " + QuestionRef + "<pre>" + response.responseText + "</pre>";
            }
            catch(err)
            {
                console.log(err.message);
            }

        },
        onerror: function (response) {
            // body...
            console.log("on error", response.responseText);
        }
    };
    GM.xmlHttpRequest(GM_payload);
}

function OH_Conformance_Helper_toggle(){
    var content = document.getElementById("oh_conformance_display_container");
    var header = document.getElementById("oh_conformance_div_helper_header");
    if(content.style.display == 'none'){
        content.style.display = 'block';
        header.innerHTML = '▲';
    }
    else {
        content.style.display = 'none';
        header.innerHTML = '▼';
    }
}

function OH_Conformance_Helper_collpase(){
    var content = document.getElementById("oh_conformance_display_container");
    var header = document.getElementById("oh_conformance_div_helper_header");
    content.style.display = 'none';
    header.innerHTML = '▼';    
}

/*
Mandatory function OH_<Help-Module-Name>_reload()
function OH_Context_Helper_reload() {
*/
function OH_Conformance_Helper_reload()
{
    div_reset_innerHTML("oh_conformance_display_container");
    OH_Conformance_Helper_collpase();
    console.log("Conformance Helper reload Here");
}

/*
Mandatory function OH_<Help-Module-Name>_init()
function OH_Context_Helper_init() {
    // Main entry point for the scripts
    // All the step which need to load once at initial time.
*/

function OH_Conformance_Helper_init() {
    /* Main entry point for the scripts */
    console.log("Conformance Helper Init Here");
}