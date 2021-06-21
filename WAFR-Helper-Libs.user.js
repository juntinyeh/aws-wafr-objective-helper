// ==UserScript==
// @name         WAFR-Review-Helper-Libs
// @namespace    http://console.aws.amazon.com/wellarchitected/
// @version      0.0.1
// @description  OH_Get_Workload_Attr --> parse the URL
// @include      https://raw.githubusercontent.com/juntinyeh/aws-wafr-objective-helper/main/
// @author       bobyeh@amazon.com (github:juntinyeh)
// @match        https://*.console.aws.amazon.com/wellarchitected/*
// @run-at       document-end
// ==/UserScript==

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

function OH_Get_Question_Ref(){
    // Find and parse the Question Text, get the Questions key
    var current_question_key;
    var has_help_button = document.getElementsByClassName("has-help-button");
    if(has_help_button.length>0)
    {
        var key_index = has_help_button[0].innerHTML.search(/^\S+\s\d+/g);
        if( key_index == 0)
        {
            current_question_key = String(has_help_button[0].innerHTML.match(/^\S+\s\d+/g));
        }
    }
    return current_question_key;
}
