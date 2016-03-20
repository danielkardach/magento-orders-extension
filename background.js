// these needs to be taken from options
var domain = 'http://localhost/magento';
var username = 'admin';
var password = 'admin123';

var SoapClient = function (domain, username, password) {
    this.adminEndpoint = domain + '/soap/default?services=integrationAdminTokenServiceV1';
    this.username = username;
    this.password = password;
};

SoapClient.prototype.login = function () {
    let body = '<api:integrationAdminTokenServiceV1CreateAdminAccessTokenRequest soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
                    `<username xsi:type="xsd:string">${this.username}</username>` +
                    `<password xsi:type="xsd:string">${this.password}</password>` +
               '</api:integrationAdminTokenServiceV1CreateAdminAccessTokenRequest>';

    let self = this;
    let callback = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(this.response, "text/xml");
                if (xmlDoc.getElementsByTagName('result').length) {
                    self.accessToken = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
                }
            }
        }
    };
    this.request(body, callback);
}

SoapClient.prototype.request = function (body, callback) {
    let wrappedBody = this.wrapRequest(body);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', this.adminEndpoint, true);
    xmlhttp.onreadystatechange = callback.bind(xmlhttp);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(wrappedBody);
}

SoapClient.prototype.wrapRequest =  function (body) {
    return '<?xml version="1.0" encoding="utf-8"?>' +
                '<soapenv:Envelope ' +
                    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    `xmlns:api="${this.adminEndpoint}" ` +
                    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                        '<soapenv:Body>' +
                        body +
                        '</soapenv:Body>' +
                '</soapenv:Envelope>';
}

var soap = new SoapClient(domain, username, password);
soap.login();


chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
setInterval(function () {
    if (soap.accessToken) {
		chrome.browserAction.setBadgeText({text: 'ok'});
	}
}, 2000);

