sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.ekansh.clipboard.Clipboard.controller.View1", {

		onInit: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel);
			window.addEventListener("paste", function (e) {
				that.onPaste(e);
			}, false);
		},

		onPaste: function (pasteEvent) {
			var that = this;
			this.getImageFromClipboardAsBase64(pasteEvent)
				.then(function (sBase64) {
					that.getView().getModel().setProperty("/imgSrc", sBase64);
				});
		},

		getImageFromClipboardAsBlob: function (pasteEvent) {
			return new Promise(function (resolve, reject) {
				if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
					var aItems = pasteEvent.clipboardData.items;
					for (var i = 0; i < aItems.length; i++) {
						// Skip content if not image
						if (aItems[i].type.indexOf("image") == -1) continue;
						// Retrieve image on clipboard as blob
						var oBlob = aItems[i].getAsFile();
						resolve(oBlob);
					}
					reject("noImageInClipboard");
				} else {
					reject("noItemFound");
				}
			});
		},

		getImageFromClipboardAsBase64: function (pasteEvent) {
			return new Promise(function (resolve, reject) {
				if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
					var aItems = pasteEvent.clipboardData.items;
					var bImageFound = false;
					for (var i = 0; i < aItems.length; i++) {
						// Skip content if not image
						if (aItems[i].type.indexOf("image") == -1) {
							continue;
						}
						bImageFound = true;
						// Retrieve image on clipboard as blob
						var oBlob = aItems[i].getAsFile();
						var oReader = new FileReader();
						oReader.readAsDataURL(oBlob);
						oReader.onloadend = function () {
							var sBase64data = oReader.result;
							resolve(sBase64data);
						};
					}
					if (!bImageFound) {
						reject("noImageInClipboard");
					}
				} else {
					reject("noItemFound");
				}
			});
		}
	});
});