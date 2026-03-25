// Opens the dashboard when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: "index.html" });
});

// The Invisible Scraper Engine
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "native_search") {
        
        // Fetch directly from Google without CORS proxies
        fetch(request.url)
            .then(response => response.text())
            .then(html => sendResponse({ success: true, html: html }))
            .catch(error => sendResponse({ success: false, error: error.toString() }));
        
        return true; // Tells Chrome to wait for the async fetch to finish
    }
});
