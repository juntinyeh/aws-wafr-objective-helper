// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.2.0
// @description  Split the original all-in-one user script into 4 modules.
// @description  Review-Helper ==> The base div,  
// @description  Context-Helper ==> Load the JSON and show the context,
// @description  FollowUp-Helper ==> linked to backend stack for recording related follow up items
// @description  Conformance-Helper ==> will link to background checking mechanism and pop up the necessary information for current check result. 
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/master/
// @require      WAFR-Context-Helper.user.js
// @require      WAFR-FollowUP-Helper.user.js
// @require      WAFR-Conformance-Helper.user.js
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/
var LOG_LEVEL = '';

var OH_ENABLE_CONTEXT_HELPER = true;
var OH_ENABLE_FOLLOWUP_HELPER = false;
var OH_ENABLE_CONFORMANCE_HELPER = false;
/*
Note: To append a new module into this helper chain, please append a switch flag here. 
*/


/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_R_DIV_HELPER_CONTAINER_DIV_READY = false; // register flag for container div ready
/***************************************/


var oh_div_helper = document.createElement('div');
    oh_div_helper.id = 'oh_div_helper';

/***************************************/
/* DOM Handling */
/* Find the Question location and append a Div */
/* Append the objective content right after Question */
function DOM_Append_Helper_Div() {
    if(OH_R_HELPER_CONTAINER_DIV_READY) return;

    var objs = document.getElementsByClassName("awsui-form-field awsui-form-field-stretch");

    objs[0].appendChild(oh_div_helper);
    DOM_Helper_reset();

    //Append the enable module switch flag, then call the Append_Div in Module
    if(OH_ENABLE_CONTEXT_HELPER) OH_Context_Helper_Append_Div();
    if(OH_ENABLE_FOLLOWUP_HELPER) OH_FollowUp_Helper_Append_Div();
    if(OH_ENABLE_CONFORMANCE_HELPER) OH_Conformance_Helper_Append_Div();

    OH_R_HELPER_CONTAINER_DIV_READY = true; 
}

function DOM_Helper_reset()
{
    oh_div_helper.innerHTML = '';
}

function DOM_Check_Helper_Existed() {
    var objs = document.getElementById(oh_div_helper.id);
    if(objs === null){
        OH_R_HELPER_CONTAINER_DIV_READY = false;
    }
    return OH_R_HELPER_CONTAINER_DIV_READY;
}

function DOM_Refresh_Check(){
    if(DOM_Check_Helper_Existed() == false) 
        DOM_Append_Helper_Div();
}

function OH_bootstrap() {
    /* Main entry point for the scripts */
    /* Append any init function here in each module */

    /* Load Context Helper */
    if(OH_ENABLE_CONTEXT_HELPER) OH_Context_Helper_init();
    /* Load FollowUp Helper */
    if(OH_ENABLE_FOLLOWUP_HELPER) OH_FolloUp_Helper_init();
    /* Load Conformance Helper */
    if(OH_ENABLE_CONFORMANCE_HELPER) OH_Conformance_Helper_init();
    /*
    Note: To append a new module into this helper chain, append a init procedure call for each module "if the module require some default action like remote data fetch."
    */

    /* Do not remove this default DOM Check setInterval */
    /* Cuz the AWS console frontend mechansim, if user swtich from one question to another, the whole page & userscript will not reload until you press F5 or command-R, so we do background refresh check in every 5s */
    setInterval(DOM_Refresh_Check, 5000);

    /* You can set your own Interval in module init() */
}

OH_bootstrap();