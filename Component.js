(function () {
	"use strict";

	/*global jQuery, sap */
	jQuery.sap.declare("cis.FLPugin.Component");
	jQuery.sap.require("sap.ui.core.Component");

	var sComponentName = "cis.FLPugin";

	// new Component
	sap.ui.core.Component.extend("com.demo.flp.usrimg.op.Component", {

		metadata: {
			version: "@version@",
			library: "sap.ushell.demo.UIPluginSampleAddHeaderItems"
		},

		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oShellContainer,
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		init: function () {
			var that = this,
				fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

			this._getRenderer().fail(function (sErrorMessage) {
					jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
				})
				.done(function (oRenderer) {
					var imageSource = "/sap/public/bc/ui2/logon/custom_images/" + sap.ushell.Container.getUser().getId() + ".jpg";

					var smallImage = imageSource + "?size=SMALL";
					//Below is for the small icon on top left
					$("#meAreaHeaderButton").html("<img style='max-width: 100%; height:auto;' src=" + smallImage + ">");

					//Below is for the Me area
					var biggerImage = imageSource + "?size=BIG";
					$(".sapUshellMeAreaUserImage").html("<img style='max-width: 100%; height:auto; position:absolute; left: -0px; top: -0px;' src=" +
						biggerImage + ">");
				});

		},

		exit: function () {
			if (this._oShellContainer && this._onRendererCreated) {
				this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
			}
		},

		after: function () {
			// var imageSourceBIG = "/sap/public/bc/ui2/logon/img/Saurabh.jpg";
			// $(".sapUshellMeAreaUserImage").html("<img style='max-width: 100%; height:auto;' src=" + imageSourceBIG + ">");
		}
	});
})();