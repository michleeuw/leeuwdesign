( function() {

		var MovingVehicles = function(imageFiles, speed, interval) {
			this.initialize(imageFiles, speed, interval);
		}
		var p = MovingVehicles.prototype = new createjs.Container();
		// inherit from Container
		p.Container_initialize = p.initialize;
			
		p.initialize = function(imageFiles, speed, interval) {
			this.Container_initialize();
			this.vehicles = [];
			this.directionFactor = 1;
			this.speed = speed;
			this.interval = interval;
			this.currentVehicle = null;			
			for (var i = 0; i < imageFiles.length; i++) {
				var vehicleImage = new createjs.Bitmap(imageFiles[i].src);
				vehicleImage.y = imageFiles[i].y;
				this.addChild(vehicleImage);
				vehicleImage.visible = false;
				this.vehicles.push(vehicleImage);
			}
			p.showRandomVehicle(this);
		}
		p.showRandomVehicle = function(obj) {
			if (obj.currentVehicle != null) {
				obj.currentVehicle.visible = false;
			}
			var randInd = Math.floor(Math.random() * obj.vehicles.length);
			obj.currentVehicle = obj.vehicles[randInd];
			obj.currentVehicle.visible = true;
			obj.directionFactor *= -1;
			switch(obj.directionFactor){
				case 1:
				obj.currentVehicle.scaleX = 1;
				obj.currentVehicle.x = -500;
				break;
				case -1:
				obj.currentVehicle.scaleX = -1;
				obj.currentVehicle.x = stage.canvas.width + 500;
				break;
			}
			obj.removeEventListener("tick", p.moveVehicle);	
			var randTime = Math.random() * obj.interval;
			setTimeout(function(randTime) {
				obj.addEventListener("tick", p.moveVehicle);				
			}, randTime);
		}
		p.moveVehicle = function(evt) {
			var obj = evt.target;
			obj.currentVehicle.x += obj.speed * obj.directionFactor;
			
			if (obj.directionFactor == 1 && obj.currentVehicle.x > stage.canvas.width) {
				p.showRandomVehicle(obj);
			}else if (obj.directionFactor == -1 && obj.currentVehicle.x < 0) {
				p.showRandomVehicle(obj);
			}
		}
		p.startAnimation = function() {
			this.addEventListener("tick", p.moveVehicle);
		}
		p.stopAnimation = function() {
			this.removeEventListener("tick", p.moveVehicle);
		}		
		window.MovingVehicles = MovingVehicles;
	}()); 