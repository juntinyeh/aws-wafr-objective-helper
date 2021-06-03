// ==UserScript==
// @name         (AWS WAFR OH!) Amazon Web Services Well-Architected Framework Review Objective Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       bobyeh@amazon.com (github:juntinyeh)
// @author       ssslim@amazon.com (github:)
// @match        https://console.aws.amazon.com/wellarchitected/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// ==/UserScript==
console.log(Date.now());

var OH_CONTENT;

function DOM_AppendOHEntryButton() {
    'use strict';
    console.log(Date.now());
    console.log("loaded");
    var objs = document.getElementsByClassName("awsui-util-action-stripe");
    console.log('objs->'+objs[0]);
    var oh_div_button = document.createElement('div');
    oh_div_button.id = 'oh_div_button';
    oh_div_button.innerHTML = '<button onclick="OH_DivToggle()">Show Objective</button>';
    objs[0].appendChild(oh_div_button);
    var oh_div_helper_container = document.createElement('div');
    oh_div_helper_container.id = 'oh_div_helper_container';
    console.log("append button & container div");
}

function OH_DivToggle() {
  var x = document.getElementById("oh_div_helper_container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function DOM_IdentifyCurrentPillarQuestion(){
    console.log(Date.now());
    console.log("loaded");
    var objs = document.getElementsByClassName("aas-form");
    console.log('objs:'+objs);
    console.log('objs->'+objs.length);
}

function EXT_GetObjHelperJSON(){

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/master/objective-helper/objective-helper.en.json",
        onload: function(response) {
            alert(response.responseText);
            OH_CONTENT = JSON.parse(response.responseText);
            console.log(OH_CONTENT);
            if(OH_CONTENT === undefined)
            {
                alert('Unable to load the Objective Helper JSON, Please feed your monkey with proper privilege.');
            }
            else
            {
                setTimeout(DOM_IdentifyCurrentPillarQuestion(),6000);
                setTimeout(DOM_AppendOHEntryButton(),7000);
            }
        }
    });
}

//document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
function OH_bootstrap() {
    EXT_GetObjHelperJSON();
}

OH_bootstrap();