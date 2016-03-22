var soapClient = (function () {

	return {
		login: function () {
			this.testRequiredSettings();

			let endpoint = localStorage["optionsHost"] + "/soap/default?services=integrationAdminTokenServiceV1";

			let body = '<api:integrationAdminTokenServiceV1CreateAdminAccessTokenRequest soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
							`<username xsi:type="xsd:string">${localStorage["optionsLogin"]}</username>` +
							`<password xsi:type="xsd:string">${localStorage["optionsPassword"]}</password>` +
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
			
			this.request(endpoint, body, callback);
		},

		getOrders: function () {
			this.testRequiredSettings();

			let endpoint = localStorage["optionsHost"] + "/soap/default?services=salesOrderRepositoryV1";

			let body = '<api:salesOrderRepositoryV1GetListRequest soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
			                '<api:searchCriteria>' +
			                    '<api:filterGroups>' +
			                        '<api:item>' +
			                            '<api:filters>' +
			                                '<api:field>id</api:field>' +
			                                `<api:value>${ localStorage["lastId"] }</api:value>` +
			                                '<api:condition_type>gt</api:condition_type>' +
			                            '</api:filters>' +
			                        '</api:item>' +
			                    '</api:filterGroups>' +
			                '</api:searchCriteria>' +
            		   '</api:salesOrderRepositoryV1GetListRequest>';

            let self = this;
            let callback = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						let parser = new DOMParser();
						let xmlDoc = parser.parseFromString(this.response, "text/xml");
						if (xmlDoc.getElementsByTagName('Reason').length > 0) {
						    if (xmlDoc.getElementsByTagName('Reason')[0].firstChild.nextSibling
						        .textContent.indexOf("Consumer is not authorized") != -1) {
						        self.login();
						    }
						}
					}
				}
			};

            this.request(endpoint, body, callback, localStorage["accessToken"]);
		},

		request: function (endpoint, body, callback, token=null) {
			let wrappedBody = this.wrapRequest(endpoint, body);

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', endpoint, true);
			xmlhttp.onreadystatechange = callback.bind(xmlhttp);
			xmlhttp.setRequestHeader('Content-Type', 'text/xml');
			if (token) {
			    xmlhttp.setRequestHeader('Authorization', `Bearer ${ token }`);
			}
			xmlhttp.send(wrappedBody);
		},

		wrapRequest: function (endpoint, body) {
			return '<?xml version="1.0" encoding="utf-8"?>' +
						'<soapenv:Envelope ' +
							'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
							`xmlns:api="${endpoint}" ` +
							'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
							'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
								'<soapenv:Body>' +
								body +
								'</soapenv:Body>' +
						'</soapenv:Envelope>';
		},

		testRequiredSettings: function () {
			if (!localStorage['optionsLogin'] ||
			!localStorage['optionsPassword'] ||
			!localStorage['optionsHost']) {
				throw new Error('Please go to options page and set required fields.');
			}
		}
	}
	
})();