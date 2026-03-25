chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape_linkedin") {
        let prospects = [];
        
        // Target standard LinkedIn search result cards
        let resultCards = document.querySelectorAll('.reusable-search__result-container');

        resultCards.forEach(card => {
            // Target the specific span that holds the pristine name
            let nameEl = card.querySelector('.entity-result__title-text a span[aria-hidden="true"]');
            
            if (nameEl) {
                let rawName = nameEl.innerText.trim();
                // Clean the name: Remove "2nd degree connection", emojis, and commas
                let cleanName = rawName.split('\n')[0].split(',')[0].replace(/[^a-zA-Z\s-]/g, '').trim();
                
                // Filter out "LinkedIn Member" hidden profiles
                if (cleanName && cleanName.length > 2 && !cleanName.toLowerCase().includes("linkedin")) {
                    prospects.push(cleanName);
                }
            }
        });

        // Fallback for different LinkedIn UI layouts or Sales Navigator
        if (prospects.length === 0) {
            let fallbacks = document.querySelectorAll('.entity-result__title-text');
            fallbacks.forEach(f => {
                let n = f.innerText.split('\n')[0].trim().replace(/[^a-zA-Z\s-]/g, '');
                if(n && !n.toLowerCase().includes("linkedin")) prospects.push(n);
            });
        }

        // Remove duplicates and send back to the Dashboard
        const uniqueProspects = [...new Set(prospects)];
        sendResponse({ success: true, data: uniqueProspects });
    }
    return true; // Keep message channel open for async response
});
