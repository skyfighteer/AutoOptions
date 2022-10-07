let optionsPage;
chrome.runtime.onInstalled.addListener((details) => {
    const options = chrome.runtime.getManifest().options_ui;
    const popup = chrome.runtime.getManifest().action;
    if (options) optionsPage = options.page;
    else if (popup) optionsPage = popup.default_popup;
    else throw new Error("AutoOptions Error: There is no options page declared in manifest.");
    if (details.reason === "install") {
        createOptionsTab();
    };
});

chrome.runtime.onMessage.addListener((message)=> {
    if (message === "openOptions") createOptionsTab();
});

function createOptionsTab() {
    chrome.tabs.create({
        url: optionsPage
    });
}