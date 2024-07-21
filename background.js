chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ startTimestamp: null, endTimestamp: null }, function () {
        if (chrome.runtime.lastError) {
            console.log("Runtime error.");
        }
    });
});  