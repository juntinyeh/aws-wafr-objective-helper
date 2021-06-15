// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - FollowUp Module
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.2.1
// @description  To append useful message for WAFR host.
// @author       ssslim@amazon.com (github:stephensalim)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==


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


/* Mandatory function : OH_<Help-Module-Name>_Append_Div()

function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}
*/

function OH_FollowUp_Helper_Append_Div(){
    oh_div_helper.appendChild(document.createElement("br"));
    oh_div_helper.appendChild(oh_followup_div_helper); //append the div of module
}


/***************************************/

/* To create a element with an click event listner which will send out httpReq. This will require CSP override, please make sure your CSP overrided on your browser. Disclaimer:::: Please make sure you understand if you override your CSP, your browser will be able to create remote communication. Please understand this will send data from your session outo the remote host, and be careful about the data privacy and security. */

/* HTTP Request Handler */
function OH_FH_HttpReq_Handler(method, url, data, headers, callback){
    var GM_payload = {
        method: method,
        url: url,
        data: data,
        headers: headers,
        onload: function(response) {
            console.log(response.responseText);
            callback(response);
        }
    };
    GM.xmlHttpRequest(GM_payload);
}

function OH_FollowUp_Helper_reload() {
    onsole.log("FollowUp Helper reload Here");
}

function OH_FollowUp_Helper_init() {
    /* init from here */
    console.log("FollowUp Helper init Here");
}