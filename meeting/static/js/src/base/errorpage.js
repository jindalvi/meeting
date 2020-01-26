(function() {

	$("body").on("click", "a.error.back.button", function(event) {

		event.preventDefault();
		event.stopPropagation();
		console.log("here")
		console.log(window.history.back())
		window.history.back();

	});

})();