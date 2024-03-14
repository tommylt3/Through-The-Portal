
try {

    //ON page change
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            if (tab.url.includes("https://spelltable.wizards.com/game/")) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['contentScriptPlanarDeck.js']
                }).then(() => console.log("injected script file"));
            }
        }
        console.log(tab.url);
    });

} catch (e) {
    console.log(e);
}
