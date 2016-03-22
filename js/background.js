chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
var intervalId = setInterval(function () {
	try {
		let orders = soapClient.getOrders();
		chrome.browserAction.setBadgeText({text: 'ok'});
	} catch(err) {
		// check error type
		// this message needs to go to popup
		console.log(err.message);
	}
}, 2000);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.options == "ready2go")
      //sendResponse({farewell: "goodbye"});
      chrome.browserAction.setBadgeText({text: 'rcvd'}); // tmp just to show that message is received
  });