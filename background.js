chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
var items = 0;
chrome.browserAction.setBadgeText({text: items.toString()});

setInterval(function(){
	if (items > 0) {
		chrome.browserAction.setBadgeText({text: items.toString()});
	}
	
	// here we can add some code to query magento server
	items++;
}, 2000);

	