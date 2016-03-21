// these needs to be taken from options
var domain = 'http://localhost/magento';
var username = 'admin';
var password = 'admin123';

chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
var intervalId = setInterval(function () {
	try {
		soapClient.getOrders();
		chrome.browserAction.setBadgeText({text: 'ok'});
	} catch(err) {
		// check error type
		// this message needs to go to popup
		console.log(err.message);
		// only if it's known error
		clearInterval(intervalId);
	}
}, 2000);

