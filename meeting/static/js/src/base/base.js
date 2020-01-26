/*Authored by Rajesh Yogeshwar*/

/*Processing modal utility function to show or hide a processing request modal*/

/* Check for session timeout in case of inactivity */
// (function () {
	
// 	window.setInterval(function () {
		
// 		ageCookie = document.cookie.match("age");
// 		if(ageCookie) {
// 			var regex = new RegExp("age=([^;]+)");
// 			var value = regex.exec(document.cookie);

// 			if(value != null) {

// 				value = unescape(value[1]);

// 				var now = new Date();
// 				var expiresOn = new Date(Date.parse(value));
				
// 				if(now >= expiresOn) {
// 					window.location.reload();
// 				}

// 			}
// 		}

// 	}, 1000);

// })();

var processingModal = {
	
	show: function(message) {
		var modal = document.getElementById("processing-modal");
		if(message != undefined) {
			$(modal).find("div.message").html(message);
		}

		$(modal).modal({
			context: "body",
			closable: false, 
			detachable: false,
			observeChanges: true,
			onHidden: function() {
				$(modal).find("div.message").html("Processing Your Request");
			}
		}).modal("hide").modal("show");
	},

	hide: function() {
		var modal = document.getElementById("processing-modal");
		$(modal).modal({
			context: "body",
			closable: false, 
			detachable: false,
			observeChanges: true,
		}).modal("hide");
	}

};


/*Notifier utility function*/

var notify = {

	generate: function(className, message) {
		
		var self = this;
		var notifyElement = document.createElement("div");
		notifyElement.className += className;
		
		/*Delaying to ensure that element is created*/
		window.setTimeout(function() {
			notifyElement.className += " show-notify";
		}, 500);

		var notifyType = document.createElement("div");
		notifyType.setAttribute("class", "type");
		
		if(className.search("success") > 0) {

			notifyType.className += " success";
			notifyType.innerHTML = "&#x2714; Success";

		}

		if(className.search("error") > 0) {

			notifyType.className += " error";
			notifyType.innerHTML = "&#x2716; Error";

		}

		if(className.search("toast") > 0) {

			notifyType.className += " toast";
			notifyType.innerHTML = "&#x2709; Information";

		}

		var msg = document.createElement("div");
		msg.setAttribute("class", "message");
		msg.innerHTML = message;

		notifyElement.appendChild(msg);
		notifyElement.appendChild(notifyType);

		body = document.getElementsByTagName("body")[0];
		body.appendChild(notifyElement);

		if($("div.ui.dimmer").hasClass("visible")) {
			console.log("here")
			notifyElement.style.zIndex = 1001;
		}

		notifyElement.addEventListener("click", function() {
			self.dismiss();
		});

		window.setTimeout(function() {
			notifyElement.className += " hide-notify";
			notifyElement.classList.remove("show-notify");
			window.setTimeout(function() {
				if(notifyElement.parentNode == body) {
					if(body.hasChildNodes(notifyElement)) {
						notifyElement.style.zIndex = 0;
						body.removeChild(notifyElement);
					}
				}
			}, 1200);
		}, 5000);

	},

	success: function(message) {
		var className = "notify notify-success";
		this.generate(className, message);
	},

	error: function(message) {
		var className = "notify notify-error";
		this.generate(className, message);
	},

	toast: function(message) {
		var className = "notify notify-toast";
		this.generate(className, message);
	},

	dismiss: function() {
		var notifyElement = document.getElementsByClassName("notify")[0];
		body = document.getElementsByTagName("body")[0];
		if(notifyElement != undefined) {
			notifyElement.className += " hide-notify";
			notifyElement.classList.remove("show-notify");
			window.setTimeout(function() {
				notifyElement.style.zIndex = 0;
				body.removeChild(notifyElement);
			}, 1200);
		}
	}

};

$( document ).ready(function() {

	$("header").on("click", "a.item.page-menu", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$sidebar = $("body").find(".ui.left.sidebar.menu");
		$sidebar.sidebar({
			scrollLock: true,
			exclusive: true,
			onHidden: function() {
				$("body").removeClass("pushable");
			}     
		}).sidebar("toggle");

	});
	
});


/*Self invoking functions must be listed down here
-------------------------------------------------*/

/*Auto initialize semantic ui checkbox, radiobuttons, accordions, dropdowns*/

(function() {

	$(".ui.dropdown").dropdown({allowTab: true});
	$(".ui.checkbox").checkbox({});
	$(".ui.accordion").accordion({});
	$(".ui.progress").progress({});
	$(".ui.search.selection.dropdown").dropdown({
		allowTab: false,
		forceSelection: true,
		selectOnKeydown: false
	});

	var calendars = document.querySelectorAll("div.sui-calendar");

	// calendars.forEach(function(element) {

	for(index=0; index< calendars.length; index++) {

		element = calendars[index];

		console.log("element = ", element);

		var calendarConfig = {};
		var calendarType = element.getAttribute("data-type");
		var maxDate = element.getAttribute("data-max");
		var minDate = element.getAttribute("data-min");
		
		var today = new Date();

		if(calendarType == undefined) {
			calendarType = "date";
		}

		var calendarConfig = {
			type: calendarType
		}

		if(maxDate != undefined) {
			if(maxDate == "today") {
				calendarConfig["maxDate"] = today;
			}
			else {
				var maxDate = new Date(maxDate);
				calendarConfig["maxDate"] = maxDate;
			}
		}
		
		if(minDate != undefined) {
			if(minDate == "today") {
				calendarConfig["minDate"] = today;
			}
			else {
				var minDate = new Date(minDate);
				calendarConfig["minDate"] = minDate;
			}
		}

		$(element).calendar(calendarConfig);

	};

})();


/*Auto initialize numeric validation for input fields marked with class numeric*/

(function() {

	$("body").on("keypress", "input.numeric", function(event) {

		$element = $(this);
		event = (event) ? event : window.event;
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	});

})();


/*Auto initialize float type validation for input fields marked with class float*/

(function() {

	$("body").on("keypress", "input.float", function(event) {

		event = (event) ? event : window.event;
		var charCode = (event.which) ? event.which : event.keyCode
		if (charCode > 31 && ((charCode < 48 && charCode!= 46) || charCode > 57))
			return false;

		if(charCode == 46) {
			if($(this).val().includes(".")) {
				return false;
			}
		}

		return true;

	});

})();


/*Auto initialize deferred images*/

(function() {

	var deferedImages = document.getElementsByClassName("deferred-image");
	for(var i=0; i < deferedImages.length; i++) {
		if(deferedImages[i].getAttribute("data-src")) {
			deferedImages[i].setAttribute("src", deferedImages[i].getAttribute("data-src"));
		}
	}

})();


(function() {

	var $globalSearch = $(".ui.global.search");

	$globalSearch.search({
		apiSettings: {
			url: "/search/?q={query}",
			cache: false
		}
	});

})();


(function() {

	$("header").on("click", "a.item.application-menu", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$sidebar = $("body").find(".ui.applications.sidebar");
		$sidebar.sidebar({
			scrollLock: true,
			exclusive: true,
			onHidden: function() {
				$("body").removeClass("pushable");
			}     
		}).sidebar("toggle");

	});

})();


(function() {

	$(document).on("change blur", "input[type=text], input[type=password], input[type=number], input[type=email], input.dropdown-hidden", function() {

		var value = $(this).val();

		if(value != undefined) {

			value = value.trim();

			if(value.length > 0) {
				if($(this).hasClass("dropdown-hidden")) {
					$(this).parent().addClass("has-value");
				}
				else {
					$(this).addClass("has-value");
				}
			}
			else {
				if($(this).hasClass("dropdown-hidden")) {
					$(this).parent().removeClass("has-value");
				}
				else {
					$(this).removeClass("has-value");
				}
			}

		}

	});

})();


(function() {

	$(document).on("change", ".ui.search.dropdown > input[type=hidden]", function() {

		var value = $(this).val();
		if(value != undefined) {

			value = value.trim();
			
			if(value.length > 0) {
				$(this).parent().addClass("has-value");
			}
			else {
				$(this).parent().removeClass("has-value");
			}

		}

	});

})();


(function() {

	$("header").on("click", "a.item.page-menu", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$sidebar = $("body").find(".ui.left.sidebar.options.menu");
		$sidebar.sidebar({
			scrollLock: true,
			exclusive: true,
			onHidden: function() {
				$("body").removeClass("pushable");
			}     
		}).sidebar("toggle");

	});

})();


(function() {

	$(document).on("reset", "form", function() {

		$form = $(this);
		$form.find(".ui.dropdown").each(function(idx, elem) {

			$(elem).dropdown("clear");

		});

		$form.find("input[type=text]").each(function(idx, elem) {

			$(elem).removeClass("has-value");
			$(elem).attr("value", "");

		});

		$form.find("input[type=radio][checked]").each(function(idx, elem) {

			$(elem).removeAttr("checked");
			
		});
	});

})();


(function() {

	$("header").on("click", "a.item.user-menu", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$sidebar = $("body").find(".ui.right.sidebar.user.menu");
		$sidebar.sidebar({
			scrollLock: true,
			exclusive: true,
			onHidden: function() {
				$("body").removeClass("pushable");
			}     
		}).sidebar("toggle");

	});

})();


(function() {

	$("body").on("click", "div.show-more", function(event) {

		$self = $(this);
		$container = $self.parent();
		$elements = $container.find(".collapsed.item").slice(0, 3);

		$elements.each(function(idx, element) {

			$(element).transition({
				duration: 500,
				animation: "slide up"
			});
			
			$(element).removeClass("collapsed");

		});

		$collapsedItems = $container.find(".collapsed.item");
		if($collapsedItems.length == 0) {
			$(this).addClass("disabled");
		}

	});

})();

/* Displays the dated records container */
(function() {
	$("body").on("click", "a.dated-records", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$self = $(this);

		$item = $self.parent().parent();

		$item.find("div.dated-records-container").transition({
			animation: "slide down"
		});
	}); 
})();

/* Displays the correction records container */
(function() {
	$("body").on("click", "a.correction-records", function(event) {
		
		event.preventDefault();
		event.stopPropagation();

		$self = $(this);

		$item = $self.parent().parent();

		$item.find("div.correction-records-container").transition({
			animation: "slide down"
		});

	}); 
})();


/* Display scroll top button after detecting scroll position*/
(function() {

	window.onload = function(event) {

		var scrollTop = $(window).scrollTop();
		var windowHeight = window.outerHeight

		if(scrollTop > (windowHeight * 0.75)) {
			$("body").find("div.scroll-to-top").addClass("active");
		}
		else {
			$("body").find("div.scroll-to-top").removeClass("active");  
		}

	}

})();


(function() {
	
	$(window).scroll(function(event) {
		
		var scrollTop = $(window).scrollTop();
		var windowHeight = window.outerHeight

		if(scrollTop > (windowHeight * 0.75)) {
			$("body").find("div.scroll-to-top").addClass("active");
		}
		else {
			$("body").find("div.scroll-to-top").removeClass("active");  
		}
		
	});

})();

/* Scroll to top */
(function() {
	
	$("body").on("click", "div.scroll-to-top", function() {
		scrollToStart();
	});

})();


/*Visually count up the number on page load*/
$(function() {
	function count($element){

		var originalValue = parseInt($element.data("count"), 10);

		if($element.find("span.value").length > 0) {
			
			var current = parseInt($element.find("span.value").html(), 10);
			if(current >= $element.data("count")){

				if($element.attr("data-value") !== undefined) {
					$element.find("span.value").html($element.attr("data-value"));
				}

				return;
			}

			current = current + parseInt((originalValue * 0.05));
			$element.find("span.value").html(current);
			
			if(current !== $element.find("span.value").data("count")){
				setTimeout(function(){count($element.find("span.value"))}, 10);
			}

		}
		else {
			var current = parseInt($element.html(), 10);
			
			if(current === $element.data("count")){

				if($element.attr("data-value") !== undefined) {
					$element.html($element.attr("data-value"));
				}			

				return;
			}

			current = current + parseInt((originalValue * 0.05));
			$element.html(current);

			if(current !== $element.data("count")){
				setTimeout(function(){count($element)}, 10);
			}
		}

		
	}

	window.onload = function() {

		$("div.figure[data-animate=yes]").each(function(idx, figure) {

			if($(figure).find("span.value").length > 0) {
				var value = $(figure).attr("data-canonical");
				$(figure).find("span.value").data("count", parseInt(value, 10));
				$(figure).find("span.value").html("0");
				count($(figure).find("span.value"));
			}

		});
		
	}

});

function getDomainName(hostName)
{
    return ;
}


(function() {

	var hostName = window.location.hostname;
	var wsScheme = window.location.protocol == "https:" ? "wss" : "ws";

	var hostName = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1)

	hostName = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1)

	var path = wsScheme + hostName;

	var anchor = document.querySelector("a.item.notifications");

	if(anchor != undefined && anchor != null) {

		var url = anchor.getAttribute("data-url");
		if(url != undefined) {

			socket = new WebSocket(wsScheme + "://"+ url);
			
			socket.onerror = function(event) {
				console.log(event)
			}

			socket.onmessage = function(event) {
				console.log("message");
			}

			socket.onopen = function() {
				socket.send("Connected");
			}
			
		}

	}



})();


/*Explicitly callable functions reside here*/

var initializeControls = function($form) {
	
	console.log("form = ", $form);

	$form.find(".ui.dropdown").dropdown({allowTab: true});
	$form.find(".ui.dropdown.disabled").dropdown({allowTab: false});
	$form.find(".ui.checkbox").checkbox({});
	$form.find(".ui.accordion").accordion({});
	$form.find(".ui.progress").progress({});
	$form.find(".ui.search.dropdown").dropdown({
		allowTab: false,
		forceSelection: false,
		selectOnKeydown: false
	});

}


var animateForm = function($delegate, target, transition, action, exitTarget) {
	
	switch(action) {
		case "open":
			$form = $delegate.find(target);
			$form.transition(transition);        
						
			$("body").animate({
				 scrollTop: $form.offset().top - 80
			}, 600);
			break;

		case "close":
			$form = $delegate.find(target);
			$exitTarget = $delegate.find(exitTarget);

			$("body").animate({
					 scrollTop: $exitTarget.offset().top - 80
			}, 600);

			$form.transition(transition);        
			break;    
	}

}


var scrollToStart = function() {

	$("html, body").animate({
		scrollTop: 0
	}, 600);

}


var scrollToContainer = function($target) {
	$("body, html").animate({
			 scrollTop: $target.offset().top - 80
	}, 600);
}


var stopDefaultFormSubmit = function($form) {

	if($form === undefined) {

		$(".ui.form").on("submit", function(event) {

			event.preventDefault();
			return false;

		});

	}

	else {

		$form.on("submit", function(event) {
			
			event.preventDefault();
			return false;

		});

	}


}


var showConfirmationModal = function(options) {

	$confirmationModal = $("body").find(".ui.confirmation.modal");  
	$message = $confirmationModal.find("h4.confirmation-message");

	var oldMessage = "Are you sure you want to continue?";
	if(options != undefined) {
		if(options.hasOwnProperty("replacementMessage")) {
			$message.html(options.replacementMessage);
		}
	}

	$confirmationModal.modal({
		closable: false,
		detachable: false,
		allowMultiple: true,
		observeChanges: true,
		transition: "fly up",
		onApprove: function() {
			$confirmationModal.modal("hide");
			window.setTimeout(function() {
				options.onApprove();
			}, 400);
		},
		onDeny: function() {
			if(options.hasOwnProperty("onDeny")) {
				options.onDeny();
			} else {
				$confirmationModal.modal("hide");
			}
			processingModal.hide();
		},
		onHide: function() {
			if(options.replacementMessage)
				$message.html(options.replacementMessage);
			else
				$message.html(oldMessage);
		}
	}).modal("show").modal("cache sizes");

}


var ajaxFormSubmit = function($form, onSuccess, onFailure) {

	var data = $form.serializeArray()
			.filter(function(item){
				if(item.value != "") {
					return item;
				}
			});
	
	$.ajax({
		url: $form.attr("action"),
		method: $form.attr("method"),
		data: data,
		global: false,  
		beforeSend: function() {
			$form.find(".ui.tiny.button").addClass("disabled");
			processingModal.show();
		}
	}).done(function(data) {

		if(onSuccess != undefined) {
			onSuccess(data);
			$form.find(".ui.tiny.button").removeClass("disabled");
		}
		
		if(onSuccess == undefined && data.hasOwnProperty("redirect")) {
			window.location.href = data.redirect;
		}

		if(onSuccess == undefined && data.hasOwnProperty("message")) {
			$form.form("reset");

			$("body")
			.toast({
				class: "success",
				position: "top right",
				message:data.message
			});

			// notify.success(data.message);
			$form.find(".ui.tiny.button").removeClass("disabled");
		}
	}).fail(function(xhr, status, error) {
		
		processingModal.hide();
		$form.find(".ui.tiny.button").removeClass("disabled");
		
		if(onFailure != undefined) {
			onFailure(xhr, status);
		}
		else {
			$("body")
			.toast({
				class: "error",
				position: "right top",
				message:xhr.responseJSON.message
			});
		}

	}).always(function(xhr, status) {
		window.setTimeout(function() {
			processingModal.hide();
		}, 400);
	});


}


var ajaxDeleteItem = function($element, url, onSuccess, onFailure) {

	var options = {};
	var replacementMessage = null;

	if($element.attr("data-delete-cnfmsg") != undefined) {
		replacementMessage = $element.attr("data-delete-cnfmsg");
		options["replacementMessage"] = replacementMessage;
	}
	else {
		options["replacementMessage"] = "Are you sure you want to delete this item?"; 
	}

	options["onApprove"] = function() {

		$.ajax({
			method: "POST",
			url: url,
			data: { csrfmiddlewaretoken: getCSRF() }
		}).done(function(response) {
			if(onSuccess != undefined) {
				onSuccess(response);
			}
			else {
				notify.success(response.message);
				$element.remove();
			}
			$confirmationModal.find("div.positive.action.button").html("Yes");
			$confirmationModal.find("div.action.button").removeClass("disabled");
			processingModal.hide();
		}).fail(function(xhr, responseJSON) {
			processingModal.hide();
			if(onFailure != undefined) {
				onFailure(xhr, status);
			}
			else {
				notify.error(xhr.responseJSON.message);
			}
			$confirmationModal.find("div.positive.action.button").html("Yes");
			$confirmationModal.find("div.action.button").removeClass("disabled");
		});

	}

	showConfirmationModal(options);

}


var ajaxFileUpload = function($form, formData, onSuccess, onFailure) {

	$.ajax({
		url: $form.attr("action"),
		method: $form.attr("method"),
		data: formData,
		enctype: "multipart/form-data",
		processData: false,
		contentType: false,
		success: function(response) {
			if(onSuccess != undefined) {
				onSuccess(response);
			}

			else if(response.hasOwnProperty("message")) {
				notify.success(response.message);
			}

		},
		error: function(xhr, status) {
			processingModal.hide();
			if(onFailure != undefined) {
				onFailure(xhr, status);
			}
			else {
				notify.error(xhr.responseJSON.message);
			}
		},
		complete: function(xhr, status) {
			$form.find(".ui.submit.button").removeClass("disabled");
			window.setTimeout(function() {
				processingModal.hide();
			}, 400);
		}
	});

}


var ajaxMultiPartFormSubmit = function($form, onSuccess, onFailure) {

	var formData = new FormData();
	var canSubmit = true;

	var data = $form.serializeArray()
			.filter(function(item){
				if(item.value != "") {
					return item;
				}
			});

	$.each(data, function(idx, field) {
		formData.append(field.name, field.value);
	});

	$.each($form.find("input[type=file]"), function(idx, element) {

		var files = $(element).prop("files");
		console.log(files)

		if(files.length > 0) {

			for(var i=0; i < files.length; i++) {
				var file = files[i];
				formData.append($(element).attr("name"), file);
				
			}

		}

	});


	$.ajax({
		url: $form.attr("action"),
		method: $form.attr("method"),
		data: formData,
		enctype: "multipart/form-data",
		processData: false,
		contentType: false,
		beforeSend: function() {
			processingModal.show();
			$form.find(".ui.button").addClass("disabled");
		}
	}).done(function(data) {

		if(onSuccess != undefined) {
			onSuccess(data);
			$form.find(".ui.button").removeClass("disabled");
		}
		
		if(onSuccess == undefined && data.hasOwnProperty("redirect")) {
			window.location.href = data.redirect;
		}

		if(onSuccess == undefined && data.hasOwnProperty("message")) {
			$form.form("reset");
			notify.success(data.message);
			$form.find(".ui.button").removeClass("disabled");
		}
	}).fail(function(xhr, status, error) {
		processingModal.hide();
		
		if(onFailure != undefined) {
			onFailure(xhr, status);
		}
		else {

			if(xhr.responseJSON.message != undefined) {
				notify.error(xhr.responseJSON.message);
			}
			else {
				notify.error("Request could not be completed");
			}
		}
		
		$form.find(".ui.button").removeClass("disabled");

	}).always(function(xhr, status) {
		processingModal.hide();
	});

}


var customAjaxMultipartSubmit = function($form, formData, onSuccess, onFailure) {

	$.ajax({
		url: $form.attr("action"),
		method: $form.attr("method"),
		data: formData,
		enctype: "multipart/form-data",
		processData: false,
		contentType: false,
		beforeSend: function() {
			processingModal.show();
			$form.find(".ui.button").addClass("disabled");
		}
	}).done(function(data) {

		if(onSuccess != undefined) {
			onSuccess(data);
			$form.find(".ui.button").removeClass("disabled");
		}
		
		if(onSuccess == undefined && data.hasOwnProperty("redirect")) {
			window.location.href = data.redirect;
		}

		if(onSuccess == undefined && data.hasOwnProperty("message")) {
			$form.form("reset");
			notify.success(data.message);
			$form.find(".ui.button").removeClass("disabled");
		}
	}).fail(function(xhr, status, error) {
		processingModal.hide();
		
		if(onFailure != undefined) {
			onFailure(xhr, status);
		}
		else {

			if(xhr.responseJSON.message != undefined) {
				notify.error(xhr.responseJSON.message);
			}
			else {
				notify.error("Request could not be completed");
			}
		}

		$form.find(".ui.button").removeClass("disabled");

	}).always(function(xhr, status) {
		processingModal.hide();
	});	

}


var getCSRF = function() {

	var csrfElement = document.getElementsByName("csrfmiddlewaretoken")[0];
	return csrfElement.value;

}

/*File Uploads JS*/

var classicFileUploader = function(config) {

	$form = config.formElement;
	$fileField = config.fileElement;
	validExtensionRegex = config.validExtensionRegex;
	validationFailureMessage = config.validationFailureMessage; 
	
	$fileField.on("change", function(event) {

		var filenames = new Array();
		var files = this.files;

		for(var i=0; i < files.length; i++) {

			var file = files[i];
			filenames.push(file.name);

			var reader = new FileReader();

			$progressMessage = $form.find("div.progress.message");

			reader.onloadstart = function() {
				$form.find(".ui.submit.button").addClass("disabled");

				if(validExtensionRegex) {

					fileName = file.name.toLowerCase();

					if(!(validExtensionRegex.test(fileName))) {
						$progressMessage.empty();
						$form.find(".ui.submit.button").removeClass("disabled");
						notify.error(validationFailureMessage);
						reader.abort();         
					}

				}

			}

			reader.onprogress = function(event) {

				var completion = Math.round((event.loaded/event.total)*100);

				if(completion < 100) {
					$progressMessage.html(Math.round((event.loaded/event.total)*100) + "% imported");
				}
				else {
					$progressMessage.html("<i class='green cirle check icon'></i>File(s) <b>("+ filenames.join(", ") +")</b> imported successfully!");
				}

				$form.addClass("in-progress");
			};

			reader.onload = function() {
				$fileField.prop("files", files);
				$form.addClass("complete").removeClass("in-progress");
				$form.find(".ui.submit.button").removeClass("disabled");
			};
			
			reader.readAsDataURL(file);

		}

	});

}


/*Drag and Drop Avail ability JS*/
var isDragAndDropAvailable = function() {
	var div = document.createElement("div");
	return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
}


var dragAndDrop = function(config) {

	$form = config.formElement;
	$dragAndDropBox = config.dragAndDropElement;

	var droppedFiles = null;
	$progressMessage = $form.find("div.progress.message");

	$dragAndDropBox.on("drag dragstart dragend dragover dragenter dragleave drop", function(event) {
		event.preventDefault();
		event.stopPropagation();
	})
	.on("dragover dragenter", function() {
		$dragAndDropBox.addClass("is-dragover");
	})
	.on("dragleave dragend drop", function() {
		$dragAndDropBox.removeClass("is-dragover");
	})
	.on("drop", function(event) {

		droppedFiles = event.originalEvent.dataTransfer.files;

		var file = droppedFiles[0];
		var reader = new FileReader();
		var filenames = new Array();

		$progressMessage = $form.find("div.progress.message");

		reader.onloadstart = function() {
			$form.find(".ui.submit.button").addClass("disabled");

			if(validExtensionRegex) {

				fileName = file.name.toLowerCase();

				if(!(validExtensionRegex.test(fileName))) {
					$progressMessage.empty();
					$form.find(".ui.submit.button").removeClass("disabled");
					notify.error(validationFailureMessage);
					reader.abort();         
				}

			}

		}

		reader.onprogress = function(event) {
			
			var completion = Math.round((event.loaded/event.total)*100);

			if(completion < 100) {
				$progressMessage.html(Math.round((event.loaded/event.total)*100) + "% imported");
			}
			else {
				$progressMessage.html("<i class='green cirle check icon'></i>File <b>("+ file.name +")</b> imported successfully!");
			}

			$form.addClass("in-progress");
		};

		reader.onload = function() {
			$fileField.prop("files", droppedFiles);
			$form.addClass("complete").removeClass("in-progress");
			$form.find(".ui.submit.button").removeClass("disabled");
		};
		
		reader.readAsDataURL(file);

	});

}


/*showMore is basically function to enable infinite scroll
$delegate is root container on page to enable event delegation
target is the "Show More" button selector
item is the item/card that has been to show on click of show more
pageSize is the number of items to show on every click 
*/
var showMore = function($delegate, target, item, pageSize) {

	$delegate.on("click", target, function() {

		$self = $(this);

		if(!$self.hasClass("end")) {
			var currentPage = $self.attr("data-page");

			var start = (parseInt(currentPage) * pageSize) + 1;
			var end = (parseInt(currentPage) * pageSize ) + pageSize;

			$elements = $delegate.find(item).slice(start, end)
			$elements.removeClass("hidden");
			$self.attr("data-page", parseInt(currentPage) + 1);

			if($delegate.find(item).slice(end + 1).length <= 0) {
				$self.html("No more items");
				$self.addClass("end");
			}
			
		}

	});

}


/*Browser notifications JS authored by Akshay Suresh*/

var notificationIconUrl = "data:image/png;base64,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";


var spawnNotification = function(title, body) {
	var options = {
		icon: notificationIconUrl,
		body: body
	}
	new Notification(title, options);
}


var browserNotification = function(title, body) {
	// Let"s check if the browser supports notifications
	if (!("Notification" in window)) {
		console.log("This browser does not support desktop notification");
	}

	// Let"s check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
		// If it"s okay let"s create a notification
		spawnNotification(title, body);   
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {

		Notification.requestPermission(function (permission) {
			// If the user accepts, let"s create a notification
			if (permission === "granted") {       
				spawnNotification(title, body);   
			}
		});
	}
}


var showAddUpdateForms = function(configs) {

	// configs.forEach(function(config) {

	for(index=0;index<configs.length; index++) {

		var showFormContainer = function(config) {
			$ns = $("body").find(config.namespace);
			$ns.on("click", config.target, function(event) {
				event.preventDefault();
				event.stopPropagation();

				$self = $(this);

				$forms = $ns.find(config.formContainerSelector);

				message = document.createElement("div");
				message.setAttribute("class", "default message");
				message.textContent = "Fetching forms ...";

				$forms.html($(message));

				$forms.load($self.attr("href"), function(responseText, textStatus, xhr) {       

					if(textStatus == "error") {

						var errorMessage = "Form could not be fetched";
						var responseJSON = JSON.parse(responseText);

						if(responseJSON.hasOwnProperty("message")) {
							errorMessage = responseJSON.message;
						}

						$forms.find(".default.message").html(errorMessage)
						$forms.find(".default.message").addClass("error");

					}

					else {
						
						$form = $forms.find(config.formSelector);

						if($self.attr("data-action") != undefined) {
							$inputTypeProcess = $form.find("input[name=process]");
							if($inputTypeProcess.length > 0) {
								$inputTypeProcess.val($self.attr("data-action"));
							}
						}
						
						if(config.hasOwnProperty("isStepBased") && config.isStepBased === true) {
							stepify(config.steps);
						}

						for(i=0;i<config.callables.length; i++){

							var callcallable = function(callable){
								callable($form);
							}

							var callable = config.callables[i];
							callcallable(callable);
						}

						// config.callables.forEach(function(callable) {
							
						// 	callable($form);
						// });

					}

					$("html, body").animate({
						scrollTop: $forms.offset().top - 80
					}, 200);

				});

			});
			
		}

		var config = configs[index];
		showFormContainer(config);

	};


}


var stepify = function(steps) {


	// steps.forEach(function(step) {
	for(index=0; index<steps.lenght; index++){

		step = steps[item]

		var callEachStep = function(step) {
			$ns = $("body").find(step.namespace);

			$ns.on("submit", step.formSelector, function(event) {

				$formContainer = $ns.find(step.formContainerSelector);
				$form = $formContainer.find(step.formSelector);
				event.preventDefault();
				
				ajaxFormSubmit($form, function(response) {
					if(step.step < steps.length) {
						
						$formContainer.find("div.form-step[data-order="+ (step.step + 1) +"] > .content").html(response);

						$formContainer.find("div.form-step[data-order="+ (step.step + 1) +"]").addClass("active").siblings("div.form-step").removeClass("active");

						$form.form("reset");
						initializeControls($formContainer.find("div.form-step.active > .content > form"));

						for(i=0;i<step.postExecutionFunctionsToCall.length;i++) {

							var callEachCallable = function(callable) {
								callable($form);
							}

							var callable = step.postExecutionFunctionsToCall[i];

							callEachCallable(callable);
						}

						// if(step.postExecutionFunctionsToCall.length > 0) {
						// 	step.postExecutionFunctionsToCall.forEach(function(callable) {
						// 		callable($form);
						// 	});
						// }

						var nextStep = steps[step.step];
						$nextForm = $formContainer.find(nextStep.formSelector);

						for(i=0;i<nextStep.preExecutionFunctionsToCall.length;i++) {

							var callEachCallable = function(callable) {
								callable($form);
							}

							var callable = nextStep.preExecutionFunctionsToCall[i];
							callEachCallable(callable);
						}
						// nextStep.preExecutionFunctionsToCall.forEach(function(callable) {
						// 	callable($nextForm);
						// });           

					}
					else {

						$ns.find(step.targetContainerSelector).html(response);

						$form.form("reset");
						$form.parents(".form-step").removeClass("active");

						$ns.find("div.ui.close.button").trigger("click");

						$("html, body").animate({
							scrollTop: $ns.find(step.targetContainerSelector).offset().top
						}, 500);

						for(i=0;i<step.postExecutionFunctionsToCall.length;i++){

							var callEachCallable = function(callable) {
								callable($form);
							}

							var callable = step.postExecutionFunctionsToCall[i];

							callEachCallable(callable);
						}

						// if(step.postExecutionFunctionsToCall.length > 0) {
						// 	step.postExecutionFunctionsToCall.forEach(function(callable) {
						// 		callable($form);
						// 	});
						// }

						if(step.hasOwnProperty("successMessage")) {
							notify.success(step.successMessage);
						}
						else {
							notify.success("Details for selected item updated");
						}

					}
				}, function(xhr, status) {
					notify.error(xhr.responseJSON.message);
				});

			});
		}

		var step = steps[index]; 
		callEachStep(step);

	};

}


var autoActivateCalendar = function($form) {

	$form.find("div.sui-calendar").each(function(idx, elem) {
		
		var calendarType = $(elem).attr("data-type");
		var maxDate = $(elem).attr("data-max");
		var minDate = $(elem).attr("data-min");
		var customFormat = $(elem).attr("data-format");
		var defaultDate = $(elem).attr("data-default");
		var today = new Date();

		if(calendarType == undefined) {
			calendarType = "date";
		}

		var calendarConfig = {
			type: calendarType
		}

		if(defaultDate == "today") {
			calendarConfig["initialDate"] = today;
		}

		if(customFormat == "yes") {
			calendarConfig["monthFirst"] = false;
			calendarConfig["formatter"] = {
				date: function (date, settings) {
					if (!date) return "";
					var day = date.getDate();
					var month = date.toLocaleString("en-us", {"month": "short"});
					// var month = ("0" + (date.getMonth() + 1)).slice(-2)
					var year = date.getFullYear();
					return day + " " + month + " " + year;
				}
			}
		}

		if(maxDate != undefined) {
			if(maxDate == "today") {
				calendarConfig["maxDate"] = today;
			}
			else {
				var maxDate = new Date(maxDate);
				calendarConfig["maxDate"] = maxDate;
			}
		}
		
		if(minDate != undefined) {
			if(minDate == "today") {
				calendarConfig["minDate"] = today;
			}
			else {
				var minDate = new Date(minDate);
				calendarConfig["minDate"] = minDate;
			}
		}

		$(elem).calendar(calendarConfig);

	});

}


/*Common JS*/
var closeSection = function() {

	$("body").on("click", "div.ui.close.button", function() {

		var formContainer = $(this).attr("data-form-container");
		var selector;
		
		if($(this).attr("data-segment") != undefined) {
			selector = "div.form-container[data-form-container="+ formContainer +"]";
		}
		else {
			selector = "div.row.forms[data-form-container="+ formContainer +"]";
		}

		$("body").find(selector).slideUp(300, function() {
			$("body").find(selector).empty();
			$("body").find(selector).removeAttr("style");
		});

	});

}


var toggleHiddenContainers = function(namespace, target, container, showLabel, hideLabel, callback) {

	$("body").on("click", target, function(event) {

		event.preventDefault();
		event.stopPropagation();

		$self = $(this);
		$ns = $("body").find(namespace);
		$self.siblings(container).transition("slide down");
		
		if($self.hasClass("expanded")) {
			$self.text(showLabel);
			$self.removeClass("expanded");
		}

		else {
			$self.text(hideLabel);
			$self.addClass("expanded");
		}

		if(callback != undefined) {
			callback();
		}

	});

}


var scrollToForm = function($form) {

	$("html, body").animate({
		scrollTop: $form.offset().top - 180
	}, 600);

}


var reasonsDropdownChange = function($form) {

	$form.on("change", "input[type=hidden][name=reason]", function(event) {

		var value = $(this).val();
		$calendar = $form.find("input[name=effectivedate]").parents("div.sui-calendar");
			
		if(value == "CORX") {
			
			// $calendar.calendar("clear");
			$calendar.parents("div.inline.fields").addClass("disabled");

		}
		else {
			$calendar.parents("div.inline.fields").removeClass("disabled");
		}

	});

}


var showCollapsedItems = function() {

	$("body").on("click", "div.show-more", function(event) {

		$self = $(this);
		$container = $self.parent();
		$elements = $container.find(".collapsed.item").slice(0, 3);

		$elements.each(function(idx, element) {

			$(element).transition({
				duration: 500,
				animation: "slide up"
			});
			
			$(element).removeClass("collapsed");

		});

		$collapsedItems = $container.find(".collapsed.item");
		if($collapsedItems.length == 0) {
			$(this).addClass("disabled");
		}

	});

}


var tabify = function(namespace, templateHolderSelector, callables) {

	$(namespace).on("click", "a.tab.item", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$self = $(this);
		$ns = $("body").find(namespace);

		var hash = null; 
		if($self.attr("data-hash") != undefined) {
			hash = $self.attr("data-hash");
		}

		$self.addClass("active").siblings("a.tab.item").removeClass("active");

		var message = document.createElement("div");
		message.setAttribute("class", "default message");
		message.textContent = "Fetching your page...";

		$content = $ns.find(templateHolderSelector);
		$content.html($(message));

		$content.load($self.attr("href"), function(responseText, textStatus, xhr) {

			if(textStatus != "error") {
				if(hash != null) {
					window.location.hash = hash;
				}

				$content.find("form").each(function(index, form) {
					initializeControls($(form));
					autoActivateCalendar($(form));
				});

				if(callables != undefined) {
					$.each(callables, function(idx, callable) {
						callable();
					});					
				}
			}
			else {
				message.textContent = "The page you requested could not be fetched."
				message.setAttribute("class", "error message");
			}

		});

	});

	/*Check for hash in url and trigger the click*/

	var hash = window.location.hash;

	if(hash != undefined) {

		hash = hash.substr(1);

		if($(namespace).find("a.tab.item[data-hash='"+ hash+"']").length > 0) {
			$(namespace).find("a.tab.item[data-hash='"+ hash+"']").trigger("click");
		}

	}

}


var constructAlphabeticalMenu = function(config) {

	$ns = $(config.namespace);
	
	$ns.find("div.alphabets").each(function(idx, alphabets) {

		$records = $(alphabets).siblings("div.expandable.records");
		$(alphabets).find("a.alphabet").addClass("disabled");	

		var presentAlphabets = new Array();

		$records.find("div.item").each(function(index, element) {

			var alphabet = $(element).attr("data-alphabet");
			
			if(presentAlphabets.indexOf(alphabet) < 0) {
				presentAlphabets.push(alphabet);
			}

		});

		for(i=0;i<presentAlphabets.length;i++){

			var callEachAlphabet = function(alphabet) {
				$(alphabets).find("a.alphabet[data-alphabet=" + alphabet + "]").removeClass("disabled");
			}

			var alphabet = presentAlphabets[i]

			callEachAlphabet(alphabet)
		}

		// presentAlphabets.forEach(function(alphabet) {
		// });

	});

}


var scrollByAlphabet = function(config) {

	var namespace = config.namespace;
	
	$ns = $(namespace)
	$scope = $ns.find(config.scope);

	$ns.on("click", "a.alphabet", function(event) {

		event.preventDefault();
		event.stopPropagation();

		$self = $(this);
		$alphabets = $self.parents("div.alphabets");
		$records = $alphabets.siblings("div.expandable.records");

		$self = $(this);
		if(!$self.hasClass("disabled")) {

			var alphabet = $self.attr("data-alphabet");

			if(typeof(alphabet) == "string") {
				var selector = "div.item[data-alphabet=" + alphabet + "]";

				$element = $records.find(selector);

				if($element.length > 0) {
					$first = $element[0];
					$records.animate({
						scrollTop: $first.offsetTop
					}, 400);
				}
			}
			else {
				$records.animate({
					scrollTop: 0
				}, 400);
			}
			
		}
		

	});

}


/*The only use case for below code is rules, but this might come in handy elsewhere*/

var buildElement = function(config) {

	var type = config.type;
	var values = config.values;
	var fieldName = "value";
	var fieldLabel = config.label;

	var label = document.createElement("label");
	label.textContent = fieldLabel;

	var bottomBar = document.createElement("i");
	bottomBar.setAttribute("class", "bottom-bar");

	var field = document.createElement("div");
	field.setAttribute("class", "field");


	switch(type) {

		case "dropdown":

			var dropdown = document.createElement("div");
			dropdown.setAttribute("class", "ui search selection value dropdown");

			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", fieldName);

			var icon = document.createElement("i");
			icon.setAttribute("class", "dropdown icon");

			var placeholder = document.createElement("div");
			placeholder.setAttribute("class", "default text");

			var menu = document.createElement("div");
			menu.setAttribute("class", "menu");

			values = JSON.parse(values);

			for(i=0;i<values.length;i++){

				var callEachItem = function(item) {

					var menuItem = document.createElement("div");
					menuItem.setAttribute("class", "item");
					menuItem.setAttribute("data-value", item.value);
					menuItem.textContent = item.label;

					menu.appendChild(menuItem);
					
				}

				var item = values[i];
				callEachItem(item);
			}

			// values.forEach(function(item) {
			// 	var menuItem = document.createElement("div");
			// 	menuItem.setAttribute("class", "item");
			// 	menuItem.setAttribute("data-value", item.value);
			// 	menuItem.textContent = item.label;

			// 	menu.appendChild(menuItem);

			// });

			dropdown.appendChild(hiddenField);
			dropdown.appendChild(icon);
			dropdown.appendChild(placeholder);
			dropdown.appendChild(menu);
			field.appendChild(dropdown);
			field.appendChild(label);
			field.appendChild(bottomBar);			

			break;

		case "text":
			
			textField = document.createElement("input");
			textField.setAttribute("type", "text");
			textField.setAttribute("name", fieldName);
			field.appendChild(textField);
			field.appendChild(label);
			field.appendChild(bottomBar);

			break;

		case "float":
			
			textField = document.createElement("input");
			textField.setAttribute("type", "text");
			textField.setAttribute("name", fieldName);
			textField.setAttribute("class", "float");
			field.appendChild(textField);
			field.appendChild(label);
			field.appendChild(bottomBar);

			break;

		case "numeric":
			
			textField = document.createElement("input");
			textField.setAttribute("type", "text");
			textField.setAttribute("name", fieldName);
			textField.setAttribute("class", "numeric");
			field.appendChild(textField);
			field.appendChild(label);
			field.appendChild(bottomBar);

			break;			

		case "calendar":

			var elementId = Math.random().toString(36).substring(2);
			suiCalendar = document.createElement("div");
			suiCalendar.setAttribute("class", "sui-calendar");
			suiCalendar.setAttribute("id", elementId);
			textField = document.createElement("input");
			textField.setAttribute("type", "text");
			textField.setAttribute("name", fieldName);
			suiCalendar.appendChild(textField);
			suiCalendar.appendChild(label);
			suiCalendar.appendChild(bottomBar);
			field.appendChild(suiCalendar);
			break;

		default:
			textField = document.createElement("input");
			textField.setAttribute("type", "text");
			textField.setAttribute("name", "value");
			field.appendChild(textField);
			field.appendChild("Value");
			field.appendChild(bottomBar);
			break;		

	}

	return field;

}


var activateCustomAccordion = function($target) {

	if($target == undefined) {
		$target = $("body");
	}

	$target.on("click", "div.title", function() {

		$self = $(this);
		$parent = $self.parent();

		if($parent.hasClass("custom accordion")) {

			var action;

			if($parent.hasClass("expanded")) {
				action = "collapse";
			}

			if($parent.hasClass("collapsed")) {
				action = "expand";
			}

			if(action == "expand") {
				$parent.addClass("expanded").removeClass("collapsed");
			}

			if(action == "collapse") {
				$parent.addClass("collapsed").removeClass("expanded");
			}

		}


	});	

}


var kroneckerProduct = function (arrayOne, arrayTwo) {
		
	var arrayOneLength = arrayOne.length;
	var arrayTwoLength = arrayTwo.length;
	var totalLength = arrayOneLength * arrayTwoLength;
	var product = new Array(totalLength);

	var i=0;
	var j=0;

	for(var k=0; k < totalLength; k++) {

		if(j > arrayTwoLength) { j=0; i++ };
		product[k] = [].concat(arrayOne[i], arrayTwo[j]);
		j++;
	
	}

	return product;

}


var activateCarousel = function() {

	var slider = document.querySelector("div.slider");
	var slides = slider.querySelectorAll("div.item");

	for(var i=0; i < slides.length; i++) {

		var slide = slides[i];
		slide.setAttribute("data-order", i+1);

	}

	setInterval(function() {

		var slides = slider.querySelectorAll("div.item");
		var activeSlide = slider.querySelector("div.item.active");
		var order = activeSlide.getAttribute("data-order");

		/* Case where it is the last slide*/
		if(order == slides.length) {
			var firstSlide = slides[0];
			activeSlide.classList.remove("active");
			firstSlide.classList.add("active");
		}
		else {
			var nextActiveSlide = activeSlide.nextElementSibling;
			activeSlide.classList.remove("active");
			nextActiveSlide.classList.add("active");
		}

	}, 2000);

}


/*Form validation rules*/

var textEmptyRule = {
	type: "empty",
	prompt: "Please enter a value"
}

var dropdownEmptyRule = {
	type: "empty",
	prompt: "Please select an option"
}

var searchDropdownEmptyRule = {
	type: "empty",
	prompt: "Please select an option"    
}

var stringValidationRule = {
	type: "regExp[/^[a-zA-Z]+$/]",
	prompt: "Please enter alphabets only"
}

var nameLengthValidationRule = {
	type   : "minLength[2]",
	prompt : "Your name must be at least {ruleValue} characters"    
}

var emailValidationRule = {
	type  : "email",
	prompt  : "Enter a valid email address" 
}

var fileEmptyRule = {
	type: "empty",
	prompt: "Please select a file"
}

var checkboxEmptyRule = {
	type: "checked",
	prompt: "Please select atleast one option"
}