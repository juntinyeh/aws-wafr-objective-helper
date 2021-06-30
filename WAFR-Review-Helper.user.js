// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.4.5
// @description  Create a template for developer
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @require      WAFR-Context-Helper.user.js
// @require      WAFR-FollowUP-Helper.user.js
// @require      WAFR-Conformance-Helper.user.js
// @require      WAFR-Helper-Libs.user.js
// @require      WAFR-Helper-DOM-Libs.user.js
// @require      WAFR-Cognito-Auth.user.js
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @grant        GM.deleteValue
// @run-at       document-end
// ==/UserScript==

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/

var LOG_LEVEL = '';

var OH_ENABLE_CONTEXT_HELPER = true;
var OH_ENABLE_FOLLOWUP_HELPER = false;
var OH_ENABLE_CONFORMANCE_HELPER = true;
// a new flag for module developer ref.
var OH_ENABLE_TEPLATE = false;
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
    oh_div_helper.style.display = 'none';

var oh_div_helper_header = document.createElement('div');
    oh_div_helper_header.id = 'oh_div_helper_header';
    oh_div_helper_header.className = 'awsui-util-container-header';
    oh_div_helper_header.style.float = 'right';

var oh_div_helper_button = document.createElement('button');
    oh_div_helper_button.id = 'oh_div_helper_button';
    oh_div_helper_button.className = "awsui-button";
    oh_div_helper_button.innerHTML = 'WA Insight ▼';
    oh_div_helper_button.addEventListener("click", function() {        
        div_ani_click_toggle('oh_div_helper_button','oh_div_helper', 'WA Insight ');
        DOM_Context_Helper_Refresh_Check();
    });

    oh_div_helper_header.appendChild(oh_div_helper_button);

/***************************************/
/* DOM Handling */
/* Find the Question location and append a Div */
/* Append the objective content right after Question */
function DOM_Append_Helper_Div() {
    if(OH_R_HELPER_CONTAINER_DIV_READY) return;

    var objs = document.getElementsByClassName("awsui-form-field awsui-form-field-stretch");
    if(objs[0] != undefined && objs.length > 1 && OH_Get_Question_Ref() != undefined)
    {
        objs[0].appendChild(oh_div_helper_header);
        objs[0].appendChild(oh_div_helper);
        ele_reset_innerHTML(oh_div_helper);


        if(OH_ENABLE_FOLLOWUP_HELPER || OH_ENABLE_CONFORMANCE_HELPER){
            oh_div_helper.appendChild(OH_Auth_Append_Div());
        }

        //Append the enable module switch flag, then call the Append_Div in Module
        if(OH_ENABLE_CONTEXT_HELPER){
            oh_div_helper.appendChild(OH_Context_Helper_Append_Div());
            //append the div returned from module Context Helper
        }

        if(OH_ENABLE_CONFORMANCE_HELPER){
            oh_div_helper.appendChild(OH_Conformance_Helper_Append_Div());
        }

        if(OH_ENABLE_FOLLOWUP_HELPER){
            oh_div_helper.appendChild(OH_FollowUp_Helper_Append_Div());
        }

        // Load new module div here //
        // if(OH_ENABLE_TEPLATE) oh_div_helper.appendChild(oh_template_Append_Div());
        // Load new module div before here //


        OH_R_HELPER_CONTAINER_DIV_READY = true;
    }
    else
    {
    OH_R_HELPER_CONTAINER_DIV_READY = false;
    setTimeout(DOM_Append_Helper_Div, 5000);
    }
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

function OH_Href_Changed_Listener(){
    DOM_Refresh_Check();
    /* Load Context Helper */
    if(OH_ENABLE_CONTEXT_HELPER) OH_Context_Helper_reload();
    /* Load FollowUp Helper */
    if(OH_ENABLE_FOLLOWUP_HELPER) OH_FollowUp_Helper_reload();
    /* Load Conformance Helper */
    if(OH_ENABLE_CONFORMANCE_HELPER) OH_Conformance_Helper_reload();
    /* Load Auth module */
    if(OH_ENABLE_FOLLOWUP_HELPER || OH_ENABLE_CONFORMANCE_HELPER) OH_Auth_reload();
};

function OH_Bind_Href_Changed_Listener(){
    window.addEventListener('popstate', OH_Href_Changed_Listener);
    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };
}

function OH_Bind_Left_Links_Listener(){

    function wait_for_element(){
        return new Promise(resolve => {
            var links = document.getElementsByClassName("wizard-question-text");
            if(links.length > 0){
                for(var i=0; i < links.length; i++){
                   var t = links[i];
                     t.addEventListener("click", function(){
                    OH_Href_Changed_Listener();
                    });
                }
                return links;
            }else
            {
                setTimeout(wait_for_element, 3000);
            }
        }, reject => {
            console.log("promise reject");
        })
    }

    (async () => {
        let links = await wait_for_element();
    })();
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
    /* Load Auth module */
    if(OH_ENABLE_FOLLOWUP_HELPER || OH_ENABLE_CONFORMANCE_HELPER) OH_Auth_init();
    /*
    Note: To append a new module into this helper chain, append a init procedure call for each module "if the module require some default action like remote data fetch."
    */
    OH_Bind_Left_Links_Listener();
    OH_Bind_Href_Changed_Listener();
}

OH_bootstrap();
