// ==UserScript==
// @name         Amazon Web Services Well-Architected Framework Review Helper - Module Template
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.0.0
// @description  Give a clear module description and also revision info here
// @author       yourname@youremail.com (github:yourgithubid)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @run-at       document-end
// ==/UserScript==

/*
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/

"" @include ""   This is somewhere you want to host your own distributed repo, you will need to fork the current repo and modify it in every user.js of the package. 

// @grant        GM.xmlHttpRequest

"" @grant ""     https://wiki.greasespot.net/Metadata_Block#.40grant
                 https://wiki.greasespot.net/Greasemonkey_Manual:API

*/


/***************************************/
/* some example code
/***************************************/

/*  <-- unmark this line to see example -->


// create a parent div for your module
var oh_template_div = document.createElement('div'); //Div Container
    oh_template_div.id = 'oh_template_div';
    oh_template_div.style.display = 'block';
    oh_template_div.innerHTML = '';

// create a header div for your module, will be placed inside the parent div
var oh_template_div_header = document.createElement('div'); //Div Container
    oh_template_div_header.id = 'oh_template_div_header';
    oh_template_div_header.style.display = 'block';
    oh_template_div_header.innerHTML = '';

// create a button place in the header
var oh_template_div_header_btn = document.createElement('button');
    oh_template_div_header_btn.id = 'oh_template_div_header_btn';
    oh_template_div_header_btn.innerHTML = 'this is s button';
    oh_add_button.addEventListener("click", function() {
        some_function_here();
    });

// create a content div for your module, will be placed after/below header div

var oh_template_div_content = document.createElement('div'); //Div Container
    oh_template_div_content.id = 'oh_template_div_content';
    oh_template_div_content.style.display = 'none';

// put btn into header
    oh_template_div_helper.appendChild(oh_template_div_header_btn);
// put header into parent
    oh_template_div.appendChild(oh_template_div_helper);
// put content into parent
    oh_template_div.appendChild(oh_template_div_content);

    <-- unmark this line to see example -->  */



/* 

Mandatory function : OH_<Help-Module-Name>_Append_Div()
function OH_<Help-Module-Name>_Append_Div(){
    //Steps before the main helper Div will apend module div as ChildNode
    //here is the only chance you will call the variable oh_div_helper, append your local DOM Element into parent Div.
}

Once you finished your edit of oh_XXX_Append_Div(), please go back to Review-Helper.user.js and append into main layout component loader in function DOM_Append_Helper_Div() of WAFR-Review-Helper.user.js
with following location:

        // Load new module div here //
        // if(OH_ENABLE_TEPLATE) oh_div_helper.appendChild(oh_template_Append_Div());
        // Load new module div before here //

Call your local function and get the div object back to main frame and show. 
*/
    
function oh_template_Append_Div(){
    return oh_template_div; //return the div of module
}

/*  <-- unmark this line to see example -->

function some_function_here(){
    //doing something and return
    alert("Click");
}

    <-- unmark this line to see example --> */

function oh_template_Helper_reload() {
    onsole.log("Module reload Here");
}

/*
Mandatory function OH_<Help-Module-Name>_init()
function oh_template_Helper_init() 
    // Main entry point for the scripts
    // All the step which need to load only once at page load/reload time.
*/

function oh_template_Helper_init() {
    /* init from here */
    console.log("Module init Here");
}