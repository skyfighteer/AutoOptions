# AutoOptions - Chrome Storage API Helper
### Save Extension Preferences Automatically
Version: 0.1  
Author: skyfighteer  
License: MIT  

## Description:
This library is intended to take care of everything related to the Chrome Storage API, so you can focus on the more important things. It works completely automatically, you do not have to do anything other than the initial setup.

## Prerequisites:
This library is completely standalone, it only requires an extension using Manifest V3.  
The manifest file must include an options and a background page. Both popups and full-page options (embedded or new page) are supported.  
Please look at the example extension if something is unclear.

## Important:
1. The first time install of the extension might result in a short, bright flash and a jump to another tab. It is completely normal, and will never happen afterwards.
2. All saved inputs must have a unique ID.
3. These input types will not be saved: *button, file, hidden, image , reset, password, search, submit*.
4. If you'd like an input to have a default value, use the "checked" and "value" attributes in HTML.
5. If you'd like to include a reset button, create any clickable DOM element with the ID "reset".
6. To see the changes you made in options on the opened pages instantly, you have to set up an event listener in your content-script. You can find help in the example extension.
7. By default, the changes you make in your options will try to apply to all open pages. You can remove or change this functionality by removing / changing the first line of the "saveConfig" function from "sendToAllTab()" to "sendToCurrentTab()".

# STEPS:
1. Make sure you understand the prerequisites.
2. Include the code from "background.js" in your background page, and the code from "content-script.js" in your content script.
3. Copy the "AutoOptions.js" into your extensions' folder. Add a script tag to your options page with the "src" attribute set to the path to "AutoOptions.js".
4. If your extension is already installed, please reinstall it for this library to work properly.
