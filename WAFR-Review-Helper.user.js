// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.3.4
// @description  grant GM.get/set for modules 
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @require      WAFR-Context-Helper.user.js
// @require      WAFR-FollowUP-Helper.user.js
// @require      WAFR-Conformance-Helper.user.js
// @require      WAFR-Helper-Libs.user.js
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// ==/UserScript==

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/

var LOG_LEVEL = '';

var OH_ENABLE_CONTEXT_HELPER = true;
var OH_ENABLE_FOLLOWUP_HELPER = false;
var OH_ENABLE_CONFORMANCE_HELPER = true;
/*
Note: To append a new module into this helper chain, please append a switch flag here.
*/


/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_R_HELPER_CONTAINER_DIV_READY = false;
// register flag for container div ready
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
    if(objs[0] != undefined)
    {
        objs[0].appendChild(oh_div_helper);
        DOM_Helper_reset();

    //Append the enable module switch flag, then call the Append_Div in Module
    if(OH_ENABLE_CONTEXT_HELPER){
        oh_div_helper.appendChild(document.createElement("br"));
        oh_div_helper.appendChild(OH_Context_Helper_Append_Div()); 
        //append the div returned from module Context Helper
      }

    if(OH_ENABLE_FOLLOWUP_HELPER){
        oh_div_helper.appendChild(document.createElement("br"));
        oh_div_helper.appendChild(OH_FollowUp_Helper_Append_Div());
    }

    if(OH_ENABLE_CONFORMANCE_HELPER){
        oh_div_helper.appendChild(document.createElement("br"));
        oh_div_helper.appendChild(OH_Conformance_Helper_Append_Div());
    }

    OH_R_HELPER_CONTAINER_DIV_READY = true;
    }
    else
    {
    OH_R_HELPER_CONTAINER_DIV_READY = false;
    setTimeout(DOM_Append_Helper_Div, 5000);
    }
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
    DOM_Append_Helper_Div();
    /* Load Context Helper */
    if(OH_ENABLE_CONTEXT_HELPER) OH_Context_Helper_init();
    /* Load FollowUp Helper */
    if(OH_ENABLE_FOLLOWUP_HELPER) OH_FollowUp_Helper_init();
    /* Load Conformance Helper */
    if(OH_ENABLE_CONFORMANCE_HELPER) OH_Conformance_Helper_init();
    /*
    Note: To append a new module into this helper chain, append a init procedure call for each module "if the module require some default action like remote data fetch."
    */
}

function OH_Href_Changed_Listener(){
    DOM_Refresh_Check();
    /* Load Context Helper */
    if(OH_ENABLE_CONTEXT_HELPER) OH_Context_Helper_reload();
    /* Load FollowUp Helper */
    if(OH_ENABLE_FOLLOWUP_HELPER) OH_FollowUp_Helper_reload();
    /* Load Conformance Helper */
    if(OH_ENABLE_CONFORMANCE_HELPER) OH_Conformance_Helper_reload();
};

window.addEventListener('popstate', OH_Href_Changed_Listener);
const pushUrl = (href) => {
  history.pushState({}, '', href);
  window.dispatchEvent(new Event('popstate'));
};

OH_bootstrap();
