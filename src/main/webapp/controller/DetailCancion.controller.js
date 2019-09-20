sap.ui.define([
	"sap/ui/core/routing/History"
], function(History) {
	"use strict";

    return sap.ui.core.mvc.Controller.extend("Music.controller.DetailCancion", {

        onInit: function() {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.getRoute("DetailCancion").attachPatternMatched(this._onRouteMatched, this);

			let that = this;

			this.updater = function() {

				let oModel  = that.getView().getModel("Canciones");
				let page    = that.getView().byId("page");
				let slider 	= that.getView().byId("slider");
				let iniTime = that.getView().byId("initTime");
				let Cancion = page.getBindingContext().getPath();
				Cancion  	= Cancion.substring(1, Cancion.length);

				let path	= oModel.sServiceUrl + Cancion + "/$value";

				if( that.audio.src === path) {
					let duration = Math.trunc(that.audio.currentTime);
		
					slider.setValue(duration);
					iniTime.setText(that.toMinutes(duration));
				}
				else{
					slider.setValue(0);
					iniTime.setText("0:00");
				}
				
			}

        },

        _onRouteMatched : function (oEvent) {

			let oArgs = oEvent.getParameter("arguments");

			let oModel  = this.getView().getModel("Canciones");
			let page    = this.getView().byId("page");
			let path	= "/Canciones(" + oArgs.id + ")";
			let slider 	= this.getView().byId("slider");
			let iniTime = this.getView().byId("initTime");
			let button 	= this.getView().byId("playBtn");

			page.setModel(oModel);
			page.bindContext(path);
			
			let Cancion = page.getBindingContext().getPath();
			Cancion  	= Cancion.substring(1, Cancion.length);

			path 		= oModel.sServiceUrl + Cancion + "/$value";

			let that 	= this;

			if( this.audio ) {
				if( this.audio.src !== path) {
					button.setIcon("sap-icon://media-play");
					this.audio.ontimeupdate = undefined;
					slider.setValue(0);
					iniTime.setText("0:00");
				}
				else {
					this.audio.ontimeupdate = this.updater;
					if(this.audio.paused === true ) {
						button.setIcon("sap-icon://media-play");
						let duration = Math.trunc(that.audio.currentTime);

						slider.setValue(duration);
						iniTime.setText(that.toMinutes(duration));
					}
					else {
						button.setIcon("sap-icon://media-pause");
					}
				}
			}

		},

		onPlay: function(oEvent) {

			let Cancion  = oEvent.getSource().getBindingContext().getPath();
			let oModel 	 = this.getView().getModel("Canciones");
			let button 	 = this.getView().byId("playBtn");
			let slider 	 = this.getView().byId("slider");
			let iniTime  = this.getView().byId("initTime");

			Cancion  	 = Cancion.substring(1, Cancion.length);

			let path 	 = oModel.sServiceUrl + Cancion + "/$value";
			let that 	 = this;

			let updater = function() {
				if( that.audio.src === path) {
					let duration = Math.trunc(that.audio.currentTime);

					slider.setValue(duration);
					iniTime.setText(that.toMinutes(duration));
				}
				else{
					slider.setValue(0);
					iniTime.setText("0:00");
				}
			}

			if( !this.audio ) {
				this.audio 		= new Audio();
				this.audio.src 	= path;

				this.audio.ontimeupdate = this.updater;
			}
			else {
				if( this.audio.src !== path ) {
					this.audio.src = path;
					this.audio.play();

					this.audio.ontimeupdate = this.updater;
					button.setIcon("sap-icon://media-pause");
					return;
				}
			}
			
			if(this.audio.paused === true) {
				this.audio.play();
				button.setIcon("sap-icon://media-pause");
			}
			else {
				this.audio.pause();
				button.setIcon("sap-icon://media-play");
			}
			
		},

		toMinutes: function(duration) {
			let date = new Date(0, 0, 0, 0, 0, 0, 0);
			date.setSeconds(duration);

			let str = date.getMinutes() + ":" + date.getSeconds();
			return str;
		},

        onBack : function () {
		
			let oHistory = History.getInstance();
            let sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } 
            else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Music", true);
            }

		},
		
		sliderChange: function() {
			// Poner los valores al time de la song y añadir el evento
			let slider 	 = this.getView().byId("slider");

			let time = slider.getValue();

			if( this.audio ){
				this.audio.pause();
				this.audio.currentTime  = time;
				this.audio.play();
				this.audio.ontimeupdate = this.updater;
			}

		},

		sliderLiveChangin: function() {
			
			if( this.audio ){
				this.audio.ontimeupdate = undefined;
			}

		}

    });
});