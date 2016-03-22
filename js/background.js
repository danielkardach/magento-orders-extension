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

