(function() {

var Background = function(image, width, y, speed) {
  this.initialize(image, width, y, speed);
}
var p = Background.prototype = new createjs.Container(); // inherit from Container
p.image1;
p.image2;
p.imageWidth = 3207;


p.Container_initialize = p.initialize;

p.initialize = function(image, width, y, speed) {
	p.imageWidth = width;
	p.image1 = new createjs.Bitmap(image);
	p.image1.y = y;
	p.image2 = new createjs.Bitmap(image);
	p.image2.x = p.imageWidth;	
	p.image2.y = y;
	p.addChild(p.image1, p.image2);		
}
p.moveBg = function() {
	console.log(">>>" + p.imageWidth)
	p.image1.x -= speed;
	p.image2.x -= speed;
	
	if (p.image1.x < -p.imageWidth ) {
			p.image1.x = p.imageWidth;
	}
	if (p.image2.x <  -p.imageWidth) {
			p.image2.x =  p.imageWidth;
	}	
}
p.startAnimation = function() {
	createjs.Ticker.addEventListener("tick", p.moveBg);
}
p.stopAnimation = function() {
	createjs.Ticker.removeEventListener("tick", p.moveBg);
}
window.Background = Background;
}());