Common = (function() {

	var common = {};
	var $wrapper = $(".common-wrapper");

	
	common.initialize = function(page) {
		setup(page);
	}

	var toogleTabs = function() {

		$wrapper.on("click", "a.item", function() {

			$self = $(this);

			$wrapper.find("a.item").removeClass("active");

			$self.addClass("active");

			$wrapper.find("div.dataitem").addClass("transition hidden");

			$wrapper.find("div.dataitem[data-type="+$self.attr("data-type")+"]").removeClass("transition hidden");
		});

	}
	

	var landingHandler = function() {

		$header = $("div.ui.top.fixed.borderless.menu.page-header");

		var showLoginForm = function() {

			$header.on("click", "a.ui.inverted.button[data-type=login]", function() {

				$self = $(this);

				$modal = $wrapper.find("div.ui.modal[data-type=loginmodal]");

				$modal.modal({
					closable: false,
					detachable: false
				}).modal("show");
				
			});
		
		}

		var showSignUpForm = function() {

			$header.on("click", "a.ui.inverted.button[data-type=signup]", function() {

				$self = $(this);

				$modal = $wrapper.find("div.ui.modal[data-type=signupmodal]");

				$modal.modal({
					closable: false,
					detachable: false
				}).modal("show");
				
			});
		
		}

		var toggleButtonsFunctions = function() {

			$modal = $wrapper.find("div.ui.modal[data-type=signupmodal]");

			$modal.on("click", "a.ui.toggle.button", function() {
				
				$self = $(this);

				$wrapper.find("a.ui.toggle.button").removeClass("positive");
				$self.addClass("positive");

				$("input[type=hidden][name=registeruser-type]").val($self.attr("data-type"));
			
			});
		
		}

		var submitLoginForm = function() {

			$modal = $wrapper.find("div.ui.modal[data-type=loginmodal]");


			$modal.on("click", "input[type=submit]", function() {

				$form = $modal.find("form.ui.login.form");

				var url = $form.attr("action");

				event.stopPropagation();
				event.preventDefault();

				var username = $("input[type=text][name=username]").val();
				var password = $("input[type=password][name=password]").val();

				var data = {
					"username": username,
					"password": password,
					"csrfmiddlewaretoken": getCSRF()
				}

				$.ajax({
					type: "post",
					url: url,
					data: data,
				}).done(function(response) {
					processingModal.hide();
					$modal.modal("hide");
					window.location.href = response.redirect_url;

				}).fail(function(xhr, status, error) {
					processingModal.hide();
					$form.find("div.errors").removeClass("transition hidden");
					$modal.transition('shake');
				});

			});
		
		}

		var submitSignUpForm = function() {

			$modal = $wrapper.find("div.ui.modal[data-type=signupmodal]");
			$form = $modal.find("form.ui.signup-form.form");
			
			stopDefaultFormSubmit($form);
			$form.on("click", "input[type=submit]", function(event) {
				$self = $(this);

			});

			$form.form({
				inline: true,
				on: "submit",
				keyboardShortcuts: false,
				fields: {
					firstName: {
						identifier: "firstname",
						rules: [ textEmptyRule ]
					},
					lastName: {
						identifier: "lastname",
						rules: [ textEmptyRule ]
					},
					password: {
						identifier: "password",
						rules: [ textEmptyRule ]
					},
					email: {
						identifier: "email",
						rules: [ textEmptyRule ]
					},
					mobileNo: {
						identifier: "mobileno",
						rules: [ textEmptyRule ]
					}

				},
				onSuccess: function(event, fields) {
					var userType = $("input[type=hidden][name=registeruser-type]").val();

					if (userType == "") {
						notify.error("Please select where you want to register as hostel owner or a tenant");
					}else{
						ajaxFormSubmit($form, function(response){
							window.location.href = response.redirect_url
						});
					}
				}
			});
		}


		var content = [
			{ title: 'Andorra' },
			{ title: 'United Arab Emirates' },
			{ title: 'Afghanistan' },
			{ title: 'Antigua' },
			{ title: 'Anguilla' },
			{ title: 'Albania' },
			{ title: 'Armenia' },
			{ title: 'Netherlands Antilles' },
			{ title: 'Angola' },
			{ title: 'Argentina' },
			{ title: 'American Samoa' },
			{ title: 'Austria' },
			{ title: 'Australia' },
			{ title: 'Aruba' },
			{ title: 'Aland Islands' },
			{ title: 'Azerbaijan' },
			{ title: 'Bosnia' },
			{ title: 'Barbados' },
			{ title: 'Bangladesh' },
			{ title: 'Belgium' },
			{ title: 'Burkina Faso' },
			{ title: 'Bulgaria' },
			{ title: 'Bahrain' },
			{ title: 'Burundi' },
			{ title: 'India' },
			{ title: 'Kota' },
			{ title: 'Jaipur' }
		
		];

		$('.ui.search').search({
			source: content
		});

		showLoginForm();
		showSignUpForm();
		submitLoginForm();
		submitSignUpForm();
		toggleButtonsFunctions();


	}

	var hostelOwnerPageHandler = function() {
		
		toogleTabs();

		var closeSection = function($container, clickable, $addAddressContainer) {

			$wrapper.on("click", clickable, function(){

				$addAddressContainer.addClass("transition hidden");
				
				$container.css({
					'display':'block'
				})

			});
		
		}

		var EditForm = function($form) {

			$wrapper.on("click", "a.ui.red.ribbon.label[data-type=edit-form]", function() {

				$form.find("input[type=text]").attr("readonly", false);

				$form.find(".ui.positive.action.submit.button").attr("disabled", false);

			});
		}

		var addUpdateAddress = function($form) {

			$profileContainer = $wrapper.find("div.dataitem[data-type=profile]");

			$form.form({
				inline: true,
				on: "submit",
				keyboardShortcuts: false,
				fields: {
					firstLine: {
						identifier: "firstline",
						rules: [ textEmptyRule ]
					},
					secondLine: {
						identifier: "secondline",
						rules: [ textEmptyRule ]
					},
					city: {
						identifier: "city",
						rules: [ textEmptyRule ]
					},
					pincode: {
						identifier: "pincode",
						rules: [ textEmptyRule ]
					}

				},
				onSuccess: function(event, fields) {
					event.stopPropagation();
					event.preventDefault();
					ajaxFormSubmit($form, function(response){
						$profileContainer.html(response);
					});
				}
			});
		
		}

		var addUpdatePanDetail = function($form) {

			$profileContainer = $wrapper.find("div.dataitem[data-type=profile]");

			$form.form({
				inline: true,
				on: "submit",
				keyboardShortcuts: false,
				fields: {
					fullName: {
						identifier: "fullname",
						rules: [ textEmptyRule ]
					},
					panNumber: {
						identifier: "pan-number",
						rules: [ textEmptyRule ]
					}

				},
				onSuccess: function(event, fields) {
					event.stopPropagation();
					event.preventDefault();
					ajaxFormSubmit($form, function(response){
						$profileContainer.html(response);
					});
				}
			});


		}

		var getaddUpdateAddressForm = function() {

			$wrapper.on("click", "a.ui.red.ribbon.label[data-type=addupdate-address]", function(event) {

				event.stopPropagation();
				event.preventDefault();
				$self = $(this);

				var url = $self.attr("data-href");

				$addressSegment = $wrapper.find("div.ui.segment[data-item=address]");

				$addAddressContainer = $wrapper.find("div.ui.segment[data-type=addupdate-address]");

				data = {}

				$.ajax({
					type: "get",
					url: url,
					data: data,
				}).done(function(response) {
					processingModal.hide();

					$addAddressContainer.removeClass("transition hidden");

					$addressSegment.css({
						'display':'none'
					});

					$addAddressContainer.find("div.segment-container").html(response);

					$(".ui.dropdown").dropdown();

					$form = $addAddressContainer.find("form.ui.form[data-form=add-update-address]");

					closeSection($addressSegment, "a.ui.tiny.uppercase.negative.button", $addAddressContainer);

					addUpdateAddress($form);

					EditForm($form);

				}).fail(function(xhr, status, error) {
					processingModal.hide();
					notify.error(xhr.responseJSON.message);
				});

			});
		
		}

		var getaddUpdatePanForm = function() {

			$wrapper.on("click", "a.ui.green.ribbon.label[data-type=addupdate-pandetail]", function(event) {

				event.stopPropagation();
				event.preventDefault();
				$self = $(this);

				var url = $self.attr("data-href");

				$panDetailSegment = $wrapper.find("div.ui.segment[data-item=pandetail]");

				$panDetailContainer = $wrapper.find("div.ui.segment[data-type=addupdate-pandetail]");

				data = {}

				$.ajax({
					type: "get",
					url: url,
					data: data,
				}).done(function(response) {
					processingModal.hide();

					$panDetailContainer.removeClass("transition hidden");

					$panDetailSegment.css({
						'display':'none'
					});

					$panDetailContainer.find("div.segment-container").html(response);

					$(".ui.dropdown").dropdown();

					$form = $panDetailContainer.find("form.ui.form[data-form=add-update-pan]");

					closeSection($panDetailSegment, "a.ui.tiny.uppercase.negative.button", $panDetailContainer);

					addUpdatePanDetail($form);

				}).fail(function(xhr, status, error) {
					processingModal.hide();
					notify.error(xhr.responseJSON.message);
				});

			});
		
		}

		getaddUpdatePanForm();
		getaddUpdateAddressForm();
	
	}

	var tenantPageHandler = function() {

		toogleTabs();
	}

	var hostelDetailHandler = function() {

		var showRightSideImage = function() {

			$wrapper.on("click", "i.chevron.circle.right.icon", function() {

				$self = $(this);

				console.log("self = ", $self);
			});
		
		}


		var showLeftSideImage = function() {

			$wrapper.on("click", "i.chevron.circle.left.icon", function() {

				$self = $(this);

				console.log("self = ", $self);
			});
		
		}

		var addHostelReview = function() {

			$form = $wrapper.find("form.ui.review.form");

			$reviewContainer = $wrapper.find("div.sixteen.wide.column[data-type=hostelreview]");
			stopDefaultFormSubmit($form);

			$form.form({
				inline: true,
				on: "submit",
				keyboardShortcuts: false,
				fields: {
					Review: {
						identifier: "review",
						rules: [ textEmptyRule ]
					},
				},
				onSuccess: function(event, fields) {
					ajaxFormSubmit($form, function(response){
						$reviewContainer.html(response);
					});
				}
			});
		
		}

		var imageSlider = function() {

			$('.owl-carousel').owlCarousel({
				center: true,
				items:1,
				margin:10,
				nav: true,
				dots: true,
				navText : ["<i class='left chevron icon'></i>","<i class='right chevron icon'></i>"],
				dotsEach: true,
				singleItem: true
			});
		}

		// var slideIndex = 1;
		// showDivs(slideIndex);

		// function plusDivs(n) {
		// 	showDivs(slideIndex += n);
		// }

		// function showDivs(n) {
		// 	var i;
		// 	var x = document.getElementsByClassName("hostelimages");
		// 	if (n > x.length) {slideIndex = 1}
		// 	if (n < 1) {slideIndex = x.length}
		// 	for (i = 0; i < x.length; i++) {
		// 		x[i].style.display = "none";  
		// 	}
		// 	x[slideIndex-1].style.display = "block";  
		// }

		// hostelSlider();
		// showLeftSideImage();
		// showRightSideImage();

		imageSlider();
		addHostelReview();

	}

	var addUpdateHostel = function() {

		var removeHostelPicture = function() {

			$wrapper.on("click", "i.red.remove.icon", function() {

				$self = $(this);

				console.log("self = ", $self);

				$imageContainer = $wrapper.find("div.hostel-images[data-container=hostel-images]");

				console.log("href = ", $imageContainer.attr("data-href"));

				event.stopPropagation();
				event.preventDefault();

				var data = {
					"csrfmiddlewaretoken": getCSRF(),
					'picture': $self.attr("data-item")
				}

				$.ajax({
					type: "post",
					url: $imageContainer.attr("data-href"),
					data: data,
				}).done(function(response) {

					processingModal.hide();
					$imageContainer.html(response);

				}).fail(function(xhr, status, error) {
					processingModal.hide();
				});

			});
		
		}

		removeHostelPicture();
	}

	
	var setup = function(page) {

		switch(page) {
			case "homepage":
				landingHandler();
				break;

			case "tenantpage":
				tenantPageHandler();
				break;

			case "hostelownerpage":
				hostelOwnerPageHandler();
				break;

			case "hosteldetail":
				hostelDetailHandler();
				break;

			case "addupdatehostel":
				addUpdateHostel();
				break;


		}
	}

	return common;
})();			