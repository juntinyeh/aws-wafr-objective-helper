// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.3.0
// @description  0.3.0 Change the setInterval to EventListener, works on FF&Chrome
// @description  0.2.0 Split the original all-in-one user script into 4 modules.
// @description  Review-Helper ==> The base div,  
// @description  Context-Helper ==> Load the JSON and show the context,
// @description  FollowUp-Helper ==> linked to backend stack for recording related follow up items
// @description  Conformance-Helper ==> will link to background checking mechanism and pop up the necessary information for current check result. 
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
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
    if(objs[0] != undefined)
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

function OH_Get_Workload_Attr()
{
    var href = window.location.href;
    if(href.indexOf("/workload/")>0)
    {
        var result;
        var attr;
        if(href.indexOf("pillar")>0)
        {
            result = href.match(/\/wellarchitected\/home\?region=(\S+)#\/workload\/(\S+)\/lens\/(\S+)\/pillar.*\?owner=(\d+)/);
            attr = {"region" : result[1], 
                    "workloadid" : result[2],
                    "lens" : result[3],
                    "userid" : result[4]};
        }
        else if(href.indexOf("lens")>0)
        {
            result = href.match(/\/wellarchitected\/home\?region=(\S+)#\/workload\/(\S+)\/lens\/(\S+)\?owner=(\d+)/);
            attr = {"region" : result[1],
                    "workloadid" : result[2],
                    "lens" : result[3],
                    "userid" : result[4]};
        }
        else
        {
        //default handling
            result = href.match(/\/wellarchitected\/home\?region=(\S+)#\/workload\/(\S+)\/.*\?owner=(\d+)/);
            attr = {"region" : result[1],
                    "workloadid" : result[2],
                    "userid" : result[3]};
       }
       return attr;
    }
}

function OH_bootstrap() {
    /* Main entry point for the scripts */
    /* Append any init function here in each module */

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
    /* Include the */
    console.log(OH_Get_Workload_Attr());
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

