sap.ui.define([
    "sap/m/ObjectListItem"
], function(ObjectListItem) {
    "use strict";

    return sap.ui.core.mvc.Controller.extend("Music.controller.Music", {

        onInit: function() {

            function productListFactory(sId, oContext) {
				
				let control = new ObjectListItem({
					title		: "{Titulo}",
                    intro		: "{Autor}"
                });
                
                control.setType(sap.m.ListType.Navigation);
                control.attachPress(this.onItemSelected, this);

				return control;
			}

			let oModel  = this.getOwnerComponent().getModel("Canciones");
			let list    = this.getView().byId("list");
			list.setModel(oModel);
			
            list.bindItems("/Canciones", productListFactory.bind(this));

        },

        _onMusicMatched: function() {

        },

        onItemSelected: function(oEvent) {

            let Cancion = oEvent.getSource().getBindingContext();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("DetailCancion", { id: Cancion.getProperty("id") });
            
        }

    });
});