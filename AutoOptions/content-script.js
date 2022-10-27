let configuration;
chrome.storage.sync.get(['configuration'], function(storedConfiguration) {
  if ('configuration' in storedConfiguration) {
    configuration = storedConfiguration.configuration;
  } else {
    chrome.runtime.sendMessage("openOptions");
  };
});
chrome.runtime.onMessage.addListener(function(message) {
  if (message.configuration) {
    configuration = message.configuration;
  };
});
