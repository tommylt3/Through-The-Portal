
try {

    //ON page change
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            if (tab.url.includes("https://spelltable.wizards.com/game/")) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['contentScript.js']
                }).then(() => console.log("injected script file"));
            }
        }
        console.log(tab.url);
    });

} catch (e) {
    console.log(e);
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      window.postMessage({ type: "TOGGLE_PLANECHASE" }, "*");
    }
  });
});