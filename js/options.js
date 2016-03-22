document.addEventListener('DOMContentLoaded', function() {
		// add event listeners
		var optionsSaveButton = document.getElementById("optionsSaveButton");
		var optionsEraseButton = document.getElementById("optionsEraseButton");

		if (optionsSaveButton) {
			optionsSaveButton.addEventListener("click", saveOptions);
		}
		else {
			alert("no save button"); //tmp
		}

		if (optionsEraseButton) {
			optionsEraseButton.addEventListener("click", eraseOptions);
		}
		else {
			alert("no save button"); //tmp
		}
		
		// load data stored in localStorage
		var login = localStorage["optionsLogin"];
		var pass = localStorage["optionsPassword"];

		document.getElementById("optionsLogin").value = login;
		document.getElementById("optionsPassword").value = pass;
	}
);

function saveOptions() {
	var login = document.getElementById("optionsLogin").value;
	var pass = document.getElementById("optionsPassword").value;

	localStorage["optionsLogin"] = login;
	localStorage["optionsPassword"] = pass;
	
	if (localStorage["optionsLogin"] != undefined 
		&& localStorage["optionsPassword"] != undefined
		&& localStorage["optionsLogin"] != "undefined" 
		&& localStorage["optionsPassword"] != "undefined") {
			chrome.runtime.sendMessage({options: "ready2go"}, function(response) {
  				//console.log(response.farewell);
		});
	}
}

function eraseOptions() {
	localStorage.removeItem("optionsLogin");
	localStorage.removeItem("optionsPassword");
	
	document.getElementById("optionsLogin").value = "";
	document.getElementById("optionsPassword").value = "";
	
	location.reload();
}