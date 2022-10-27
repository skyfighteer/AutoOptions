chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") createOptionsTab();
});

chrome.runtime.onMessage.addListener((message)=> {
    if (message === "openOptions") createOptionsTab();
});

function createOptionsTab() {
    let optionsPage;
    const options = chrome.runtime.getManifest().options_ui;
    const popup = chrome.runtime.getManifest().action;
    if (options) optionsPage = options.page;
    else if (popup) optionsPage = popup.default_popup;
    else throw new Error("AutoOptions Error: There is no options page declared in the Manifest file.");
    chrome.tabs.create({
        url: optionsPage
    });
}
