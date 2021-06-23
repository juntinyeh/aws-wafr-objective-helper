// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Conformance Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.4.0
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

var OH_WORKLOAD_REGION = '';

/***************************************/
/* CAUTION, HIGH VOLTAGE, DO NOT TOUCH */
var OH_R_CONTAINER_DIV_READY = false;
// common register flag for checking container div ready, and any new separated module will have append the frontend DOM into this div 'oh_div_helper_container'
/***************************************/


/***************************************/
/*Conformance*/

var oh_conformance_display_container = document.createElement('div'); //Div Container
    oh_conformance_display_container.id = 'oh_conformance_display_container';
    oh_conformance_display_container.style.display = 'none';
    oh_conformance_display_container.innerHTML = '';



var oh_check_button = document.createElement('button');
    oh_check_button.id = 'oh_check_button';
    oh_check_button.className = "awsui-button awsui-button-variant-primary";
    oh_check_button.innerHTML = 'Check';
    oh_check_button.addEventListener("click", function() {
        OH_Conformance_Get_Noncompliant();
        oh_check_button.style.display = 'none';
    });

    oh_conformance_display_container.appendChild(document.createElement('hr'));
    oh_conformance_display_container.appendChild(oh_check_button);

var oh_conformance_div_helper_header = document.createElement('button');
    oh_conformance_div_helper_header.className = "awsui-button awsui-button-variant-primary";
    oh_conformance_div_helper_header.id = 'oh_conformance_div_helper_header';
    oh_conformance_div_helper_header.innerHTML = 'Conformance ▼';
    oh_conformance_div_helper_header.addEventListener("click", function() {
        div_ani_click_toggle('oh_conformance_div_helper_header','oh_conformance_display_container', 'Conformance ');
    });


var oh_conformance_div_helper = document.createElement('div');
    oh_conformance_div_helper.className = 'awsui-util-container-header';
    //oh_conformance_div_helper.appendChild(oh_check_button);
    oh_conformance_div_helper.appendChild(oh_conformance_div_helper_header);
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
    (async () => {
        let id_token = await GM.getValue("id_token",-1);
        var QuestionRef = OH_Get_Question_Ref();
        var data = JSON.stringify({"questionRef":QuestionRef});    
        var url = OH_CONFORMANCE_APIGW;
        var content = document.getElementById("oh_conformance_display_container");
        var GM_payload = {
            method: 'POST',
            url: url,
            data: data,
            headers: {"Content-Type":"application/json","Authentication":id_token},
            onload: function(response) {
                try{
                    console.log(url, data,response.responseText);
                    var res = JSON.parse(response.responseText);
                    OH_Conformance_Helper_Append_Content(res);
                }
                catch(err)
                {
                    console.log(err.message, response.responseText);

                }

            },
            onerror: function (response) {
                // body...
                console.log("on error", response.responseText);
            }
        };
        console.log("GM_payload",GM_payload);
        GM.xmlHttpRequest(GM_payload);
    })();
}

function OH_Conformance_Helper_Append_Content(res)
{
    var item = "Findings";
    if(res.hasOwnProperty(item)){
        let JSON_value = res[item];
        if(typeof(JSON_value) == 'object' && Array.isArray(JSON_value))
        {
            if(JSON_value.length > 0)
            {
                if(JSON_value.length > 3)
                {
                    oh_conformance_display_container.style.height = '350px';
                    oh_conformance_display_container.style.overflow = 'auto';
                }
                let findings_key = ["ConfigRuleName","ResourceType","ResourceId"];
                for(var i=0; i< JSON_value.length; i++)
                {
                    let div = document.createElement('div');
                    let finding_text = '';
                    if(typeof(JSON_value[i]) == 'object')
                    {
                        for (const [key, value] of Object.entries(JSON_value[i]))
                        {
                            if(findings_key.includes(key))
                            {
                                if(key=="ConfigRuleName")
                                {
                                finding_text += key +" : " + OH_Conformance_deco_configrule(value) +"<br/>";
                                }
                                else
                                {
                                finding_text += key +" : "+value +"<br />";
                                }
                            }
                        }
                    }
                    div.innerHTML = div_format_key_value_to_text(" ",finding_text);
                    oh_conformance_display_container.appendChild(div);
                }
            }
            else
            {
                let div = document.createElement('div');
                div.innerHTML = '<p>No record</p>';
                oh_conformance_display_container.appendChild(div);
            }
        }
    }
}

function OH_Conformance_deco_configrule(rule_name)
{

    var url = "";
    //if(rule_name != '' && OH_WORKLOAD_REGION != '')
    //    url = "https://console.aws.amazon.com/config/home?region="+ OH_WORKLOAD_REGION +"#/rules/details?configRuleName="+rule_name;
    //hard code for temp ConfigRule Location
    url = "https://console.aws.amazon.com/config/home?region="+ "ap-southeast-2" + "#/rules/details?configRuleName="+rule_name;
    return '<a href="' + url + '" target="_blank">' + rule_name + '</a>';
}

/*
Mandatory function OH_<Help-Module-Name>_reload()
function OH_Context_Helper_reload() {
*/
function OH_Conformance_Helper_reload()
{
    div_reset_innerHTML('oh_conformance_display_container');
    div_ani_click_collapse('oh_conformance_div_helper_header','oh_conformance_display_container','Conformance ');
    oh_conformance_display_container.appendChild(document.createElement('hr'));
    oh_conformance_display_container.appendChild(oh_check_button);
    oh_check_button.style.display = 'block';

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
    OH_WORKLOAD_REGION = OH_Get_Workload_Attr()['region'];
}