sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"employeeprofileui/model/formatter"
], function (JSONModel, Controller, formatter) {
	"use strict";

	return Controller.extend("employeeprofileui.controller.Detail", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel("uiState");

			this.oRouter.getRoute("detail").attachPatternMatched(this._onEmployeeMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onEmployeeMatched, this);

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
		formatter: formatter,
		handleItemPress: function (oEvent) {
			console.log("Manager nav pressed");
		
			const oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
			const oContext = oEvent.getSource().getBindingContext("emp");
		
			if (!oContext) {
				console.warn("No binding context found.");
				return;
			}
		
			const employeePath = oContext.getPath();  // e.g., "/Employees/0"
			const employee = employeePath.split("/").pop(); // e.g., "0", or use actual key
		
			this.oRouter.navTo("detailDetail", {
				layout: oNextUIState.layout,
				manager: this._employee  // Already the full object or ID from Detail
			});
		},
		
		handleItemPress1: function (oEvent) {
			console.log("manager nav pressed")
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
				supplierPath = oEvent.getSource().getSelectedItem().getBindingContext("emp").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detailDetail", {
				layout: oNextUIState.layout,
				employee: this._employee,
			});
		},
		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", { layout: sNextLayout, employee: this._employee });
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", { layout: sNextLayout, employee: this._employee });
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("list", { layout: sNextLayout });
		},
		_onEmployeeMatched: function (oEvent) {
			this._employee = oEvent.getParameter("arguments").employee || this._employee || "0";
			this.getView().bindElement({
				path: "/EmpJob/" + this._employee,
				model: "emp"
			});

			console.log("Binding path:", "/EmpJob/" + this._employee);
			console.log("Bound data:", this.getView().getModel("emp").getProperty("/EmpJob/" + this._employee));
		}
	});
});
