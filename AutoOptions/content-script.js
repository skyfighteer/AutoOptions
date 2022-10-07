let configuration;
chrome.storage.sync.get(['configuration'], function(storedConfiguration) {
  if (Object.keys(storedConfiguration).length > 0) {
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
