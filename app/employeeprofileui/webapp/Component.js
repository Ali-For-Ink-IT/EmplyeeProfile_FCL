sap.ui.define([
	"sap/ui/core/UIComponent",
	"employeeprofileui/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	"sap/ui/model/odata/v4/ODataModel"
], function (UIComponent, models, JSONModel, library, FlexibleColumnLayoutSemanticHelper, ODataModel) {
	"use strict";

	var LayoutType = library.LayoutType;

	var Component = UIComponent.extend("employeeprofileui.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			// var oModel = new JSONModel();
			// this.setModel(oModel);

			 // set the device model
			 this.setModel(models.createDeviceModel(), "device");

		
			var oProductsModel = new JSONModel(sap.ui.require.toUrl(this.getMetadata().getComponentName().replace(/\./g, "/") + "/mockdata/products.json"));
			oProductsModel.setSizeLimit(1000);
			this.setModel(oProductsModel, "products");

			 // --- Add UI State JSON Model named "uiState" ---
			 var oUIStateModel = new JSONModel({
				layout: "OneColumn",  // default layout
				columnsDistribution: {
					desktop: {
						TwoColumnsMidExpanded: "25/75/0",
						TwoColumnsBeginExpanded: "67/33/0",
						ThreeColumnsMidExpanded: "25/50/25",
						ThreeColumnsBeginExpandedEndHidden: "67/33/0",
						ThreeColumnsMidExpandedEndHidden: "25/75/0",
						ThreeColumnsEndExpanded: "0/33/67"
					},
					tablet: {
						TwoColumnsMidExpanded: "40/60/0",
						TwoColumnsBeginExpanded: "67/33/0",
						ThreeColumnsMidExpanded: "20/60/20",
						ThreeColumnsBeginExpandedEndHidden: "67/33/0",
						ThreeColumnsMidExpandedEndHidden: "25/75/0",
						ThreeColumnsEndExpanded: "0/33/67"
					}
				}
			});
			this.setModel(oUIStateModel, "uiState");

			this.getRouter().initialize();
		},
		

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
			oParams = new URLSearchParams(window.location.search),
			oSettings = {
				defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
				defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
				maxColumnsCount: oParams.get("max")
			};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
	});
	return Component;
});
