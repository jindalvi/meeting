var buildHierarchy = function(config) {

	var tree;
	var elementSelector = config.elementSelector;
	var dataSource = config.dataSource;

	var treeConfig = {
		chart: {
			container: elementSelector,
			rootOrientation: "WEST",
			levelSeparation: 75,
			connectors: {
				"type": "step",
				"style": {
					"stroke": "#3894DB",
					"stroke-dasharray": "--", 
					"arrow-end": "classic-wide-long"
				}
			},
			node: {
				collapsed: true,
				collapsable: true,
				stackChildren: true
			},
			callback: {
				onTreeLoaded: function() {
					console.log("onTreeLoaded");
				}
			}
		}
	};

	$.get(dataSource, function(data) {

		if(data.hasOwnProperty("innerHTML")) {
			treeConfig.nodeStructure = data;
			tree = new Treant(treeConfig, function() {

			}, jQuery);
		}
		else {
			var message = document.createElement("div");
			message.setAttribute("class", "default message")
			message.textContent = config.emptyDataMessage;

			$(elementSelector).html($(message));

		}

	});


}