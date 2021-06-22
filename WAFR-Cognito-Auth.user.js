// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Conformance Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.0.1
// @description  Frontend Layout for Cognito Sign In.
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @run-at       document-end
// ==/UserScript==

/*
set Log_Level = 'debug' if you want to try something new and use the debug(log_message) it will help you to dump the timestamp and message on browser console.
*/
var LOG_LEVEL = '';

var OH_AUTH_APIGW = '';
var OH_AUTH_DEFAULT_USERNAME = '';
var OH_AUTH_DEFAULT_PASSWORD = '';
var OH_AUTH_DEFAULT_POOLID = '';
var OH_AUTH_DEFAULT_CLIENTID = '';




/***************************************/
/*Cognito Auth*/

var oh_auth_container = document.createElement('div'); //Div Container
    oh_auth_container.id = 'oh_auth_container';
    oh_auth_container.style.display = 'block';
    oh_auth_container.className = 'awsui-util-container-header'; 


var oh_auth_div_username = document.createElement('div');
    oh_auth_div_username.id = 'oh_auth_div_username';
    oh_auth_div_username.innerHTML = "username";

var oh_auth_input_username = document.createElement('input');
    oh_auth_input_username.id = 'oh_auth_input_username';
    oh_auth_input_username.type = 'text';
    oh_auth_input_username.className = 'awsui-input';
    oh_auth_input_username.value = OH_AUTH_DEFAULT_USERNAME;

    oh_auth_div_username.appendChild(oh_auth_input_username);

var oh_auth_div_password = document.createElement('div');
    oh_auth_div_password.id = 'oh_auth_div_password';
    oh_auth_div_password.innerHTML = "password";

var oh_auth_input_password = document.createElement('input');
    oh_auth_input_password.id = 'oh_auth_input_password';
    oh_auth_input_password.type = 'password';
    oh_auth_input_password.className = 'awsui-input awsui-input-type-password';
    oh_auth_input_password.value = OH_AUTH_DEFAULT_PASSWORD;

    oh_auth_div_password.appendChild(oh_auth_input_password);

var oh_auth_div_poolid = document.createElement('div');
    oh_auth_div_poolid.id = 'oh_auth_div_poolid';
    oh_auth_div_poolid.innerHTML = "poolID";

var oh_auth_input_poolid = document.createElement('input');
    oh_auth_input_poolid.id = 'oh_auth_input_poolid';
    oh_auth_input_poolid.type = 'password';
    oh_auth_input_poolid.className = 'awsui-input awsui-input-type-password';
    oh_auth_input_poolid.value = OH_AUTH_DEFAULT_POOLID;

    oh_auth_div_poolid.appendChild(oh_auth_input_poolid);

var oh_auth_div_clientid = document.createElement('div');
    oh_auth_div_clientid.id = 'oh_auth_div_clientid';
    oh_auth_div_clientid.innerHTML = "clientID";

var oh_auth_input_clientid = document.createElement('input');
    oh_auth_input_clientid.id = 'oh_auth_input_clientid';
    oh_auth_input_clientid.type = 'password';
    oh_auth_input_clientid.className = 'awsui-input awsui-input-type-password';
    oh_auth_input_clientid.value = OH_AUTH_DEFAULT_CLIENTID;

    oh_auth_div_clientid.appendChild(oh_auth_input_clientid);


var oh_auth_submit = document.createElement('button');
    oh_auth_submit.id = 'oh_auth_submit';
    oh_auth_submit.innerHTML = 'Cognito Authentication'
    oh_auth_submit.addEventListener("click", function() {        
        OH_auth_post_to_cognito();
    });
    oh_auth_submit.className = "awsui-button awsui-button-variant-primary";

    oh_auth_container.appendChild(oh_auth_div_username);
    oh_auth_container.appendChild(oh_auth_div_password);
    oh_auth_container.appendChild(oh_auth_div_poolid);
    oh_auth_container.appendChild(oh_auth_div_clientid);
    oh_auth_container.appendChild(document.createElement('br'));
    oh_auth_container.appendChild(oh_auth_submit);

/***************************************/
/* Mandatory function : OH_<Help-Module-Name>_Append_Div()

function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}
*/
function OH_Auth_Append_Div(){
    return oh_auth_container;
}

function OH_Auth_check_id_token(){
    (async () => {
        let id_token = await GM.getValue("id_token",-1);
        let id_token_ts = await GM.getValue("id_token_ts", -1);
        if(id_token == -1 || id_token_ts == -1){
            console.log("Token not exited");
        }
        else if( Math.floor(Date.now() / 1000) - id_token_ts >86400 )
        {
            console.log("Token expired");
            div_append_text('oh_auth_container','Token expired');
        }
        else
        {
            div_reset_innerHTML('oh_auth_container');
            div_append_text('oh_auth_container','Cognito Authenticated');
            console.log(id_token);
        }
    })();
}


function OH_auth_post_to_cognito(JSON_value, callback){
    data = {
            "username": oh_auth_input_username.value,
            "password": oh_auth_input_password.value,
            "userpoolid": oh_auth_input_poolid.value,
            "clientid": oh_auth_input_clientid.value
        }

    var GM_payload = {
        method: 'POST',
        url: OH_AUTH_APIGW,
        data: JSON.stringify(data),
        headers: {"Content-Type":"application/json"},
        onload: function(response) {
            var data = JSON.parse(response.responseText);
            if(data.hasOwnProperty("id_token"))
            {
                console.log("id_token",data["id_token"]);
                GM.setValue("id_token",data["id_token"]);
                GM.setValue("id_token_ts",Math.floor(Date.now() / 1000)),
                OH_Auth_check_id_token();
            }
        }
    };
    GM.xmlHttpRequest(GM_payload);
}

/*
Mandatory function OH_<Help-Module-Name>_reload()
function OH_Context_Helper_reload() {
*/
function OH_Auth_reload()
{
    OH_Auth_check_id_token();
    console.log("Conformance Helper reload Here");
}

/*
Mandatory function OH_<Help-Module-Name>_init()
function OH_Context_Helper_init() {
    // Main entry point for the scripts
    // All the step which need to load once at initial time.
*/

function OH_Auth_init() {
    /* Main entry point for the scripts */
    OH_Auth_check_id_token();
    console.log("Conformance Helper Init Here");
}
