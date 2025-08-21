sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	"employeeprofileui/model/formatter"
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, formatter) {
	"use strict";

	return Controller.extend("employeeprofileui.controller.List", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;

			// Wait for component to be fully initialized
			var that = this;
			
			setTimeout(function () {
				that._initializeModel();
			}, 2);


		},
		_initializeModel: function () {
			// Try multiple ways to get the OData model
			var oModel = this.getView().getModel() ||
				this.getOwnerComponent().getModel() ||
				this.getView().getModel("");

			console.log("OData Model:", oModel);

			if (oModel) {
				console.log("Model type:", oModel.getMetadata().getName());
				this.loadEmpJobData();
			} else {
				console.error("OData model is still undefined!");
				MessageToast.show("OData model not available");

				// Try to create OData model manually as fallback
				this._createODataModelManually();
			}
		},

		_createODataModelManually: function () {
			sap.ui.require(["sap/ui/model/odata/v4/ODataModel"], function (ODataModel) {
				var oModel = new ODataModel({
					serviceUrl: "/odata/v4/EmployeeService/",
					operationMode: "Server",
					autoExpandSelect: true,
					earlyRequests: true
				});

				this.getView().setModel(oModel);
				console.log("Manually created OData model:", oModel);

				// Now try to load data
				this.loadEmpJobData();
			}.bind(this));
		},
		loadEmpJobData: function() {
            var oModel = this.getView().getModel();
            
            if (!oModel) {
                console.error("Model is undefined");
                return;
            }

            // For OData v4, we need to use the service's requestData method
            var sPath = "/getEmpJob";
            
            try {
                // Create a binding context
                var oBinding = oModel.bindList(sPath);
                
                // Request the data
                oBinding.requestContexts().then((aContexts) => {
					var aData = [];
					aContexts.forEach((oContext) => {
						aData.push(oContext.getObject());
					});
				
					var oEmpJobModel = new sap.ui.model.json.JSONModel({
						EmpJob: aData
					});
				
					// this.getView().setModel(oEmpJobModel, "emp"); 
					this.getOwnerComponent().setModel(oEmpJobModel, "emp");

					sap.m.MessageToast.show("Success: " + aData.length + " records loaded");
				}).catch(function(oError) {
                    console.error("getEmpJob error:", oError);
                    MessageToast.show("getEmpJob failed");
                });
                
            } catch (e) {
                console.error("Exception in alternative method:", e);
            }
        },
		testModelAvailability: function() {
            var oModel = this.getView().getModel();
            console.log("Test - Model availability:", !!oModel);
            
            if (oModel) {
                console.log("Model class:", oModel.getMetadata().getName());
                console.log("Service URL:", oModel.getServiceUrl ? oModel.getServiceUrl() : "Not available");
            }
        },
		loadEmpJobData1: function () {
			var oModel = this.getView().getModel();

			if (!oModel) {
				console.error("Model is undefined in loadEmpJobData");
				return;
			}

			try {
				
				var oModel = this.getView().getModel("EmployeeService");
				oModel.callFunction("/getEmpJob", {
					method: "GET",
					success: function (oData) {
						var empJobs = oData.value; // Assuming the response contains an array of EmpJobType in the 'value' property
						console.log(empJobs);
					},
					error: function (oError) {
						console.log(oError);
					}
				});

			} catch (e) {
				console.error("Exception in loadEmpJobData:", e);
				MessageToast.show("Exception: " + e.message);
			}
		},

		loadEmpJobData2: function () {
			var oModel = this.getView().getModel();

			if (!oModel) {
				console.error("Model is undefined in loadEmpJobData");
				return;
			}

			try {
				// Use bindList instead of requestData for OData v4
				var oListBinding = oModel.bindList("/EmpJob()");

				oListBinding.requestContexts(0, 100).then(function (aContexts) {
					console.log("EmpJob contexts:", aContexts);

					var aData = aContexts.map(function (oContext) {
						return oContext.getObject();
					});

					console.log("EmpJob data:", aData);
					MessageToast.show("Data loaded: " + aData.length + " records");
				}).catch(function (oError) {
					console.error("Error loading EmpJob data:", oError);
					MessageToast.show("Error loading data: " + oError.message);
				});

			} catch (e) {
				console.error("Exception in loadEmpJobData:", e);
				MessageToast.show("Exception: " + e.message);
			}
		},
		formatter: formatter,

		onListItemPress: function (oEvent) {
			console.log("inside onListItemPress ")
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				employeePath = oEvent.getSource().getSelectedItem().getBindingContext("emp").getPath(),
				employee = employeePath.split("/").slice(-1).pop();
				// product = productPath.split("/")[2];
				
				// console.log("oNextUIState.layout==>", oNextUIState.layout)

			this.oRouter.navTo("detail", { layout: oNextUIState.layout, employee: employee });
		},
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("employeesTable").getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function (oEvent) {
			MessageBox.show("This functionality is not ready yet.", {
				icon: MessageBox.Icon.INFORMATION,
				title: "Aw, Snap!",
				actions: [MessageBox.Action.OK]
			});
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("employeesTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		}
	});
});
