window.onload = function() {
  loadOptions();
};

let configuration;
function loadOptions() {
    chrome.storage.sync.get(['configuration'], function(storedConfiguration) {
      if (Object.keys(storedConfiguration).length > 0) {
        configuration = storedConfiguration.configuration;
        setOptions();
      } else {
        chrome.runtime.sendMessage("openOptions");
      };
    });
    chrome.runtime.onMessage.addListener(function(message) {
      if (message.configuration) {
        configuration = message.configuration;
        setOptions();
      };
    });
};