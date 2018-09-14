( function() {

		var Background = function(image, width, y, speed) {
			this.initialize(image, width, y, speed);
		}
		var p = Background.prototype = new createjs.Container()

		p.Container_initialize = p.initialize;
		p.initialize = function(image, width, y, speed) {
			this.Container_initialize();
			this.imageWidth = width;
			this.speed = speed;
			this.image1 = new createjs.Bitmap(image);
			this.image1.y = y;
			this.image2 = new createjs.Bitmap(image);
			this.image2.x = this.imageWidth;
			this.image2.y = y;
			this.addChild(this.image1, this.image2);
		}
		p.moveBg = function(evt) {
			var bg = evt.target;
			bg.image1.x -= bg.speed;
			bg.image2.x -= bg.speed;
			if (bg.image1.x < -bg.imageWidth) {
				bg.image1.x = bg.imageWidth;
			}
			if (bg.image2.x < -bg.imageWidth) {
				bg.image2.x = bg.imageWidth;
			}

		}
		p.startAnimation = function() {
			this.addEventListener("tick", p.moveBg);
		}
		p.stopAnimation = function() {
			this.removeEventListener("tick", p.moveBg);
		}

		window.Background = Background;
	}());
