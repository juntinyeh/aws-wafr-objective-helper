**Module Naming Convention**
 - \<Mobule-Name\>\_Helper

**User Script File Naming Convention**
 - WAFR-\<Module-Name\>\_Helper.user.js

**Module Related Files and Sub-Dir Naming Convention**
 - Mod_\<Module-Name\>\_Helper or some dir name easy to understand

**Context-Helper for New Language support**
***Branch Naming Convention***
 - Please branch out from master anytime you want
 - branch name --> JSON/\<**LANG**\> (ISO 639-1 LANG Code)
 - ex: ```git checkout -b JSON/zh\_TW``` or ```git checkout -b JSON/id```
 - Copy from objective-helper.en.json to objective-helper.\<**LANG**\>.json
 - Keep ongoing translation staying in your new branch

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
