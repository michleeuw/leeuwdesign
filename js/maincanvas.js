var stage;
var homeSection;
var loadingBox;
var myTween;
var loadQueue;
var manifest;
var imagePath = "canvasimage/";
var background1;
var background2;
var cars;
var helicopter;
var speed = 1;

function initCanvas() {
	stage = new createjs.Stage("theCanvas");
	homeSection = $("#home");
	loadingBox = $("#loading-box");
	scrollDownArrow = $("#scroll-down-arrow");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();

	manifest = [{
		id : "bigSkyline",
		src : imagePath + "big_skyline.png"
	}, {
		id : "street",
		src : imagePath + "street.png"
	}, {
		id : "policecar",
		src : imagePath + "policecar.png",
		y: 400
	}, {
		id : "beetle",
		src : imagePath + "beetle.png",
		y: 400
	}, {
		id : "dodge",
		src : imagePath + "dodge.png",
		y: 400
	}, {
		id : "bmw",
		src : imagePath + "bmw.png",
		y: 400
	}, {
		id : "truck",
		src : imagePath + "truck.png",
		y: 350
	}, {
		id : "helicopter",
		src : imagePath + "helicopter.png",
		y: 100
	},  {
		id : "helicopter_small",
		src : imagePath + "helicopter_small.png",
		y : 50
	}];
	loadQueue = new createjs.LoadQueue();
	loadQueue.addEventListener("complete", handleComplete);
	loadQueue.addEventListener("progress", handleProgress);
	loadQueue.loadManifest(manifest);
}
function handleProgress($e) {
	loadingBox.text(Math.round($e.loaded/$e.total * 100) + "%"); 	
}
function handleComplete() {
	scrollDownArrow.show();
	loadingBox.hide();
	buildCanvas();
}
function resizeCanvas() {
	stage.canvas.width = homeSection.width();
	stage.canvas.height = homeSection.height();
	stage.update();	
}

function startCanvasAnimation() {
	background1.startAnimation();
	background2.startAnimation();
	cars.startAnimation();
	helicopter.startAnimation();
}

function stopCanvasAnimation() {
	background1.stopAnimation();
	background2.stopAnimation();
	cars.stopAnimation();
	helicopter.stopAnimation();
}

function buildCanvas() {
	background1 = new Background(manifest[0].src, 3207, 0, 0.3);
	stage.addChild(background1);
	background1.startAnimation();
	
	helicopter = new MovingVehicles([manifest[7], manifest[8]],  10, 15000);
	stage.addChild(helicopter);	
		
	background2 = new Background(manifest[1].src, 2300, 120, 0.5);
	stage.addChild(background2);
	background2.startAnimation();
	
	cars = new MovingVehicles([manifest[2], manifest[3], manifest[4], manifest[5], manifest[6]], 8, 7000);
	stage.addChild(cars);		
}
