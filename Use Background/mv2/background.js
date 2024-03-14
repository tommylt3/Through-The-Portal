


//ON page change
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  //if (changeInfo.url) {
  if(changeInfo.status == 'complete'){
    chrome.tabs.executeScript({
      file: 'contentScript.js'
    });
  }
});
