( function() {

		var Cars = function() {
			this.initialize();
		}
		var p = Cars.prototype = new createjs.Container();
		// inherit from Container
		p.Container_initialize = p.initialize;
		p.currentCar;
		p.carSpeed = 8;
		p.cars = [];
		p.directionFactor = 1;
		p.initialize = function() {
			var carFiles = [manifest[2], manifest[3], manifest[4], manifest[5], manifest[6]];
			for (var i = 0; i < carFiles.length; i++) {
				var carImage = new createjs.Bitmap(carFiles[i].src);
				carImage.y = carFiles[i].y;
				p.addChild(carImage);
				carImage.visible = false;
				p.cars.push(carImage);
			}
			p.showRandomCar();
		}
		p.showRandomCar = function() {
			createjs.Ticker.removeEventListener("tick", p.moveCar);
			if (p.currentCar) {
				p.currentCar.visible = false;
			}
			var randInd = Math.floor(Math.random() * p.cars.length);
			p.currentCar = p.cars[randInd];
			p.currentCar.visible = true;
			p.directionFactor *= -1;
			switch(p.directionFactor){
				case 1:
				p.currentCar.scaleX = 1;
				p.currentCar.x = -500;
				break;
				case -1:
				p.currentCar.scaleX = -1;
				p.currentCar.x = stage.canvas.width + 500;
				break;
			}
			
			var randTime = Math.random() * 7000;
			setTimeout(function() {
				createjs.Ticker.addEventListener("tick", p.moveCar);				
			}, randTime);
		}
		p.moveCar = function() {
			p.currentCar.x += p.carSpeed * p.directionFactor;
			if (p.directionFactor == 1 && p.currentCar.x > stage.canvas.width) {
				p.showRandomCar();
			}else if (p.directionFactor == -1 && p.currentCar.x < 0) {
				p.showRandomCar();
			}
		}
		p.startAnimation = function() {
			createjs.Ticker.addEventListener("tick", p.moveCar);
		}
		p.stopAnimation = function() {
			createjs.Ticker.removeEventListener("tick", p.moveCar);
		}		
		window.Cars = Cars;
	}()); 