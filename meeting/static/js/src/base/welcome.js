(function() {
	
	var form = document.querySelector("form.ui.login.form");
	var now = new Date();

	var header = form.querySelector("div.header");

	if(now.getHours() < 12) {
		header.innerHTML = "Good Morning. Welcome to hostelonease."
	}

	else if(now.getHours() >=12 && now.getHours() < 17) {
		header.innerHTML = "Good Afternoon. Welcome to hostelonease."
	}

	else if(now.getHours() >=17 && now.getHours() <= 24) {
		header.innerHTML = "Good Evening. Welcome to hostelonease."
	}

})();


(function() {

	inputs = document.querySelectorAll("input[type=text], input[type=password], input[type=email], input[type=number]");

	document.addEventListener("change", function(event) {

		var element = event.target;
		var elementName = element.tagName;
		var elementType = element.type;
		var value = element.value;

		var watchableTypes = ["text", "password", "number", "email"];

		if(elementName == "INPUT") {

			if(value != undefined) {
				value = value.trim();
				
				if(watchableTypes.indexOf(elementType) > -1) {
					element.classList.add("has-value");
				}
				else {
					element.classList.remove("has-value");
				}

			}
			else {
				element.classList.remove("has-value");
			}

		}

	});

})();