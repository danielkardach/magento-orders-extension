var soapClient = (function () {

	return {
		login: function () {
			this.testRequiredSettings();
			
			let body = '<api:integrationAdminTokenServiceV1CreateAdminAccessTokenRequest soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
							`<username xsi:type="xsd:string">${localStorage["username"]}</username>` +
							`<password xsi:type="xsd:string">${localStorage["password"]}</password>` +
					   '</api:integrationAdminTokenServiceV1CreateAdminAccessTokenRequest>';

			let callback = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						let parser = new DOMParser();
						let xmlDoc = parser.parseFromString(this.response, "text/xml");
						if (xmlDoc.getElementsByTagName('result').length) {
							localStorage["accessToken"] = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
						}
					}
				}
			};
			
			this.request(body, callback);
		},
		getOrders: function () {
			this.testRequiredSettings();
		},
		request: function (body, callback) {
			let wrappedBody = this.wrapRequest(body);

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', this.adminEndpoint, true);
			xmlhttp.onreadystatechange = callback.bind(xmlhttp);
			xmlhttp.setRequestHeader('Content-Type', 'text/xml');
			xmlhttp.send(wrappedBody);
		},
		wrapRequest: function (body) {
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
		},
		testRequiredSettings: function () {
			if (!localStorage['username'] || !localStorage['password'] || !localStorage['host']) {
				throw new Error('Please go to options page and set required fields.');
			}
		}
	}
	
})();