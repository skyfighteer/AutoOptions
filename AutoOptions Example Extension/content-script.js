window.onload = function() {
  loadOptions();
};

let configuration;
function loadOptions() {
    chrome.storage.sync.get(['configuration'], function(storedConfiguration) {
      if ('configuration' in storedConfiguration) {
        configuration = storedConfiguration.configuration;
        setOptions();
      } else {
        chrome.runtime.sendMessage("openOptions");
      };
    });
    // message listener
    chrome.runtime.onMessage.addListener(function(message) {
      if (message.configuration) {
        configuration = message.configuration;
        setOptions();
      };
    });
};

function setOptions() {
  document.querySelector('body').style.background = configuration.colorInput;
};
