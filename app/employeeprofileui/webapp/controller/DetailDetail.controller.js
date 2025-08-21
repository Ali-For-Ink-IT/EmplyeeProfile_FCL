sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("employeeprofileui.controller.DetailDetail", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel("uiState");

			// 🔄 Attach to route 'detailDetail'
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onManagerMatched, this);

			[oExitButton, oEnterButton].forEach(function (oButton) {
				oButton.addEventDelegate({
					onAfterRendering: function () {
						if (this.bFocusFullScreenButton) {
							this.bFocusFullScreenButton = false;
							oButton.focus();
						}
					}.bind(this)
				});
			}, this);
		},

		handleAboutPress: function () {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(3);
			this.oRouter.navTo("page2", { layout: oNextUIState.layout });
		},

		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("detailDetail", { layout: sNextLayout, manager: this._manager });
		},

		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("detailDetail", { layout: sNextLayout, manager: this._manager });
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detail", { layout: sNextLayout, employee: this._employee });
		},

		// ✅ Renamed and updated this method
		_onManagerMatched: function (oEvent) {
			this._manager = oEvent.getParameter("arguments").manager || this._manager || "0";
			this._employee = oEvent.getParameter("arguments").employee || this._employee || "0";

			// ✅ Updated binding path and model
			this.getView().bindElement({
				path: "/EmpJob/" + this._manager,
				model: "emp"
			});
		}
	});
});
