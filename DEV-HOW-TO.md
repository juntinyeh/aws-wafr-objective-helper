**Module Naming Convention**
 - \<Mobule-Name\>\_Helper

**User Script File Naming Convention**
 - WAFR-\<Module-Name\>\_Helper.user.js

**Module Related Files and Sub-Dir Naming Convention**
 - Mod_\<Module-Name\>\_Helper or some dir name easy to understand

**How to Enable/Disable the module**
Check the configuration setting in main WAFR-Review-Helper.user.js 
var OH_ENABLE_CONTEXT_HELPER = true;
var OH_ENABLE_FOLLOWUP_HELPER = false;
var OH_ENABLE_CONFORMANCE_HELPER = false;

**Context-Helper for New Language support**
***Branch Naming Convention***
 - Please branch out from master anytime you want
 - branch name --> JSON/\<**LANG**\> (ISO 639-1 LANG Code)
 - ex: ```git checkout -b JSON/zh\_TW``` or ```git checkout -b JSON/id```
 - Copy from objective-helper.en.json to objective-helper.\<**LANG**\>.json
 - Keep ongoing translation staying in your new branch

***Setup Customized & Dedicated JSON***
 - For specific usage or organization internal usage, you might want to point the Context Helper JSON into your own JSON file. 
 - Or, your private network in organization does not allow external access, then you will need to clone the JSON file from github to your internal hosting. 
 - Edit the var JSON_CUSTOMIZED in WAFR-Context-Helper.user.js
 ```
 var JSON_CUSTOMIZED = "https://abc.de/ef.json";
 var JSON_CUSTOMIZED = "https://internal.hosting/Context-helper.json"
 ```



***File Structure*** (v0.2.1)
```
.
├── LICENSE
├── README.md
├── WAFR-Review-Helper.user.js      //main entry file for review helper
├── WAFR-Conformance-Helper.user.js //conformance module
├── WAFR-Context-Helper.user.js     //context module (objective-helper)
├── WAFR-FollowUP-Helper.user.js    //followup module
├── backend							//dir for followup module backend stack
│	└── api-tester-app
│		├── README.md
│		├── __init__.py
│		├── events
│		│		└── event.json
│		├── hello_world
│		│		├── __init__.py
│		│		├── app.py
│		│		└── requirements.txt
│		├── samconfig.toml
│		├── template.yaml
│		├── tests
│		│		 ├── __init__.py
│		│		 ├── integration
│		│		 │		 ├── __init__.py
│		│		 │		 └── test_api_gateway.py
│		│		 ├── requirements.txt
│		│		 └── unit
│		│		 		├── __init__.py
│		│		 		└── test_handler.py
│		└── y
└── objective-helper.en.json to objective-helper.\<**LANG**\>.json
               //dir for context module
		├── objective-helper.Wookiee.json
		├── objective-helper.en.json
		└── objective-helper.zh_TW.json
```
