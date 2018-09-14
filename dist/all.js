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
$(document).ready(function() {
	var siteData;
	var menuButton = $("#menu-button");
	var menuCloseButton = $("#menu-close-button");
	var scrollDownArrow = $("#scroll-down-arrow");
	var commisionedTabButton = $("#commisioned-tab-button");
	var freeTabButton = $("#free-tab-button");
	var nav = $("#nav");
	var introText = $("#intro-text");
	var dutchFlag = $("#dutch-flag");
	var englishFlag = $("#english-flag");
	var languageCode = 0;
	var audioElement = null;
	var audioType = "";
	var win = $(window);
	var allMods = null;
	var bigScreen = false;

	function init() {
		$.getJSON("data/sitedata.json", function(json) {
			siteData = json;
			//NAV//////////////////////////////////////////////////////////////////////////////
		    $.each(json, function(index, data) {
				var menuItem = $('<li>').html('<a href="#' + data.name + '">' + data.title[languageCode] + '</a></li>').appendTo('#nav > ul');

				menuItem.click(function($e) {
					$("#nav li a").removeClass("active");
					$(this).find('a').addClass('active');
					var topValue = document.getElementById(data.name).offsetTop;
					scrollToSection(topValue);
					menuCloseButton.trigger("click");
				});

			});
			//ABOUT//////////////////////////////////////////////////////////////////////////////
			introText.html(json[1].description[languageCode]);
			//WEB//////////////////////////////////////////////////////////////////////////////
			$.each(json[2].projects, function(index, data) {
				var webItem = $('<div class="web-item module">').html('<div class="web-item-title">' + data.title + '</div><p>' + data.description[languageCode] + '</p></div>').appendTo('#web > .section-content');
				webItem.css({
					'background-image' : 'url("images/' + data.image + '")',
					"background-repeat" : "no-repeat",
					"background-position" : "5px 30px"
				});
				webItem.click(function() {
					window.open(data.url, '_blank');
				});

			});
			//MUSIC//////////////////////////////////////////////////////////////////////////////
			$.each(json[3].projects, function(index, data) {
				$('.music_tab_but:eq(' + index + ')').text(data.title[languageCode]);

				var musicItem = $('<div class="music-item module">').html('<p class="cat-title">' + data.title[languageCode] + '</p>').appendTo('#music > .section-content');
				$.each(data.songs, function(index, data) {
					var song = $('<div>').html('<a href="#">' + data.title + '</a></div>').appendTo(musicItem);
					if (data.description != undefined) {
						var description = $('<div>').html('<div class="song-descr">' + data.description[languageCode] + '</div></div>').appendTo(song);
					}
					song.click(function($e) {
						$e.preventDefault();
						$("#music a").removeClass("active");
						$(this).find('a').addClass('active');
						var fileName = data.file;
						var path = "music/" + fileName + "." + audioType;
						audioElement.setAttribute("src", path);
						audioElement.addEventListener("canplaythrough", songLoaded, false);
					});
				});				
			});
			$(".music-item:eq(1)").hide();
			commisionedTabButton.addClass('active');
			audioElement = document.getElementById("audio-player");
			audioType = supportedAudioFormat(audioElement);

			if (audioType == "") {
				alert("no audio support");
				return;
			}
			//CONTACT//////////////////////////////////////////////////////////////////////////////
			var telephone = $('<div class="contact-item module">').html(json[4].tel + '</div>').appendTo('#contact > .section-content');
			var email = $('<div class="contact-item module">').html(json[4].email + '</div>').appendTo('#contact > .section-content');
			
			$(".section-heading").each(function(i) {
				$(this).text(siteData[i].title[languageCode]);
			});
			

			$(window).scrollEnd(function() {
				if ($(window).scrollTop() < 450) {
					startCanvasAnimation();
				} else {
					stopCanvasAnimation();
				}
			}, 1000);

			
			bigScreen = ($(document).width() > 768)? true : false;
			allMods = $(".module");
			allMods.each(function(i, el) {
				var el = $(el);
				if (el.visible(true)) {
					el.addClass("already-visible");
				}
			});
			initCanvas();
		});

	}
	//functions///////////////////////////////////////////	
	setTimeout(function() {
		var hash = window.location.hash;
		if (hash != "") {
			var menuItemName = location.hash.slice(1);
			setActiveMenuItem(menuItemName);
			var topValue = document.getElementById(menuItemName).offsetTop;
			scrollToSection(topValue);
		} else {
			var selectedItem = $("#nav ul li a").eq(0);
			selectedItem.addClass('active');
		}
	}, 1000);	
	
	win.scroll(function(event) {
		if(!bigScreen) {
			return;
		}
		allMods.each(function(i, el) {
			var el = $(el);
			if (el.visible(true)) {
				el.addClass("come-in");				
			}
		});

	});
	
	$.fn.scrollEnd = function(callback, timeout) {
		$(this).scroll(function() {
			var $this = $(this);
			if ($this.data('scrollTimeout')) {
				clearTimeout($this.data('scrollTimeout'));
			}
			$this.data('scrollTimeout', setTimeout(callback, timeout));
		});
	};

	function changeLanguage(lc) {
		menuCloseButton.trigger("click");
		if (lc == languageCode) {
			return;
		} else {
			languageCode = lc;
		}
		introText.html(siteData[1].description[languageCode]);
		$(".section-heading").each(function(i) {
			$(this).text(siteData[i].title[languageCode]);
		});
		$('#nav').find('li a').each(function(i) {
			$(this).text(siteData[i].title[languageCode]);
		});
		$('#web').find('p').each(function(i) {
			$(this).text(siteData[2].projects[i].description[languageCode]);
		});
		$('.cat-title').each(function(i) {
			$(this).text(siteData[3].projects[i].title[languageCode]);
		});
		$('#music').find('.song-descr').each(function(i) {
			$(this).text(siteData[3].projects[0].songs[i].description[languageCode]);
		});
		$(".music_tab_but").each(function(i) {
			$(this).text(siteData[3].projects[i].title[languageCode]);
		});

	}	

	function setActiveMenuItem(itemName) {
		$("#nav li a").removeClass("active");
		for (var i = 0; i < siteData.length; i++) {
			if (siteData[i].name == itemName) {
				var selectedItem = $("#nav ul li a").eq(i);
				selectedItem.addClass('active');
			}
		}
	}

	function scrollToSection(val) {
		scrollTopElement = getScrollTopElement();

		$(scrollTopElement).stop().animate({
			scrollTop : val
		}, 1000);
	}
	//help functions//////////////////////////////////////////////////////////////
	function supportedAudioFormat(audio) {
		var returnExtension = "";
		if (audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
			returnExtension = "mp3";
		} else if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
			returnExtension = "ogg";
		} else if (audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
			returnExtension = "wav";
		}
		return returnExtension;
	}
	function getScrollTopElement() {
		if (document.compatMode !== 'CSS1Compat')
			return 'body';

		var html = document.documentElement;
		var body = document.body;
		var startingY = window.pageYOffset || body.scrollTop || html.scrollTop;
		var newY = startingY + 1;
		window.scrollTo(0, newY);
		var element = (html.scrollTop === newY ) ? 'html' : 'body';
		window.scrollTo(0, startingY);
		return element;
	}
	$.fn.visible = function(partial) {
		var $t = $(this),
		    $w = $(window),
		    viewTop = $w.scrollTop(),
		    viewBottom = viewTop + $w.height(),
		    _top = $t.offset().top,
		    _bottom = _top + $t.height(),
		    compareTop = partial === true ? _bottom : _top,
		    compareBottom = partial === true ? _top : _bottom;

		return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

	};

	function songLoaded() {
		audioElement.play();
		audioElement.removeEventListener("canplaythrough", p.songLoaded, false);
	}

	//button actions
	menuButton.click(function($e) {
		$e.preventDefault();
		menuButton.fadeOut("slow");
		nav.fadeIn("slow");
	});

	menuCloseButton.click(function($e) {
		$e.preventDefault();
		menuButton.fadeIn("slow");
		nav.fadeOut("slow");

	});

	scrollDownArrow.click(function() {
		setActiveMenuItem("about");
		var topValue = document.getElementById("about").offsetTop;
		scrollToSection(topValue);
	});

	commisionedTabButton.click(function() {
		$(".music-item:eq(0)").show();
		$(".music-item:eq(1)").hide();
		commisionedTabButton.addClass('active');
		freeTabButton.removeClass('active');
	});

	freeTabButton.click(function() {
		$(".music-item:eq(1)").show();
		$(".music-item:eq(0)").hide();
		commisionedTabButton.removeClass('active');
		freeTabButton.addClass('active');
	});

	dutchFlag.click(function() {
		changeLanguage(0);
	});

	englishFlag.click(function() {
		changeLanguage(1);
	});	
	init();
});

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

/*
 * Modernizr v1.6
 * http://www.modernizr.com
 *
 * Developed by: 
 * - Faruk Ates  http://farukat.es/
 * - Paul Irish  http://paulirish.com/
 *
 * Copyright (c) 2009-2010
 * Dual-licensed under the BSD or MIT licenses.
 * http://www.modernizr.com/license/
 */
window.Modernizr=function(i,e,u){function s(a,b){return(""+a).indexOf(b)!==-1}function D(a,b){for(var c in a)if(j[a[c]]!==u&&(!b||b(a[c],E)))return true}function n(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1);c=(a+" "+F.join(c+" ")+c).split(" ");return!!D(c,b)}function S(){f.input=function(a){for(var b=0,c=a.length;b<c;b++)L[a[b]]=!!(a[b]in h);return L}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));f.inputtypes=function(a){for(var b=0,c,k=a.length;b<
k;b++){h.setAttribute("type",a[b]);if(c=h.type!=="text"){h.value=M;if(/^range$/.test(h.type)&&h.style.WebkitAppearance!==u){l.appendChild(h);c=e.defaultView;c=c.getComputedStyle&&c.getComputedStyle(h,null).WebkitAppearance!=="textfield"&&h.offsetHeight!==0;l.removeChild(h)}else/^(search|tel)$/.test(h.type)||(c=/^(url|email)$/.test(h.type)?h.checkValidity&&h.checkValidity()===false:h.value!=M)}N[a[b]]=!!c}return N}("search tel url email datetime date month week time datetime-local number range color".split(" "))}
var f={},l=e.documentElement,E=e.createElement("modernizr"),j=E.style,h=e.createElement("input"),M=":)",O=Object.prototype.toString,q=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),F="Webkit Moz O ms Khtml".split(" "),v={svg:"http://www.w3.org/2000/svg"},d={},N={},L={},P=[],w,Q=function(a){var b=document.createElement("style"),c=e.createElement("div");b.textContent=a+"{#modernizr{height:3px}}";(e.head||e.getElementsByTagName("head")[0]).appendChild(b);c.id="modernizr";l.appendChild(c);a=c.offsetHeight===
3;b.parentNode.removeChild(b);c.parentNode.removeChild(c);return!!a},o=function(){var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return function(b,c){c=c||document.createElement(a[b]||"div");b="on"+b;var k=b in c;if(!k){c.setAttribute||(c=document.createElement("div"));if(c.setAttribute&&c.removeAttribute){c.setAttribute(b,"");k=typeof c[b]=="function";if(typeof c[b]!="undefined")c[b]=u;c.removeAttribute(b)}}return k}}(),G={}.hasOwnProperty,R;R=
typeof G!=="undefined"&&typeof G.call!=="undefined"?function(a,b){return G.call(a,b)}:function(a,b){return b in a&&typeof a.constructor.prototype[b]==="undefined"};d.flexbox=function(){var a=e.createElement("div"),b=e.createElement("div");(function(k,g,r,x){g+=":";k.style.cssText=(g+q.join(r+";"+g)).slice(0,-g.length)+(x||"")})(a,"display","box","width:42px;padding:0;");b.style.cssText=q.join("box-flex:1;")+"width:10px;";a.appendChild(b);l.appendChild(a);var c=b.offsetWidth===42;a.removeChild(b);
l.removeChild(a);return c};d.canvas=function(){var a=e.createElement("canvas");return!!(a.getContext&&a.getContext("2d"))};d.canvastext=function(){return!!(f.canvas&&typeof e.createElement("canvas").getContext("2d").fillText=="function")};d.webgl=function(){var a=e.createElement("canvas");try{if(a.getContext("webgl"))return true}catch(b){}try{if(a.getContext("experimental-webgl"))return true}catch(c){}return false};d.touch=function(){return"ontouchstart"in i||Q("@media ("+q.join("touch-enabled),(")+
"modernizr)")};d.geolocation=function(){return!!navigator.geolocation};d.postmessage=function(){return!!i.postMessage};d.websqldatabase=function(){return!!i.openDatabase};d.indexedDB=function(){for(var a=-1,b=F.length;++a<b;){var c=F[a].toLowerCase();if(i[c+"_indexedDB"]||i[c+"IndexedDB"])return true}return false};d.hashchange=function(){return o("hashchange",i)&&(document.documentMode===u||document.documentMode>7)};d.history=function(){return!!(i.history&&history.pushState)};d.draganddrop=function(){return o("drag")&&
o("dragstart")&&o("dragenter")&&o("dragover")&&o("dragleave")&&o("dragend")&&o("drop")};d.websockets=function(){return"WebSocket"in i};d.rgba=function(){j.cssText="background-color:rgba(150,255,150,.5)";return s(j.backgroundColor,"rgba")};d.hsla=function(){j.cssText="background-color:hsla(120,40%,100%,.5)";return s(j.backgroundColor,"rgba")||s(j.backgroundColor,"hsla")};d.multiplebgs=function(){j.cssText="background:url(//:),url(//:),red url(//:)";return/(url\s*\(.*?){3}/.test(j.background)};d.backgroundsize=
function(){return n("backgroundSize")};d.borderimage=function(){return n("borderImage")};d.borderradius=function(){return n("borderRadius","",function(a){return s(a,"orderRadius")})};d.boxshadow=function(){return n("boxShadow")};d.textshadow=function(){return e.createElement("div").style.textShadow===""};d.opacity=function(){var a=q.join("opacity:.5;")+"";j.cssText=a;return s(j.opacity,"0.5")};d.cssanimations=function(){return n("animationName")};d.csscolumns=function(){return n("columnCount")};d.cssgradients=
function(){var a=("background-image:"+q.join("gradient(linear,left top,right bottom,from(#9f9),to(white));background-image:")+q.join("linear-gradient(left top,#9f9, white);background-image:")).slice(0,-17);j.cssText=a;return s(j.backgroundImage,"gradient")};d.cssreflections=function(){return n("boxReflect")};d.csstransforms=function(){return!!D(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"])};d.csstransforms3d=function(){var a=!!D(["perspectiveProperty","WebkitPerspective",
"MozPerspective","OPerspective","msPerspective"]);if(a)a=Q("@media ("+q.join("transform-3d),(")+"modernizr)");return a};d.csstransitions=function(){return n("transitionProperty")};d.fontface=function(){var a,b=e.head||e.getElementsByTagName("head")[0]||l,c=e.createElement("style"),k=e.implementation||{hasFeature:function(){return false}};c.type="text/css";b.insertBefore(c,b.firstChild);a=c.sheet||c.styleSheet;b=k.hasFeature("CSS2","")?function(g){if(!(a&&g))return false;var r=false;try{a.insertRule(g,
0);r=!/unknown/i.test(a.cssRules[0].cssText);a.deleteRule(a.cssRules.length-1)}catch(x){}return r}:function(g){if(!(a&&g))return false;a.cssText=g;return a.cssText.length!==0&&!/unknown/i.test(a.cssText)&&a.cssText.replace(/\r+|\n+/g,"").indexOf(g.split(" ")[0])===0};f._fontfaceready=function(g){g(f.fontface)};return b('@font-face { font-family: "font"; src: "font.ttf"; }')};d.video=function(){var a=e.createElement("video"),b=!!a.canPlayType;if(b){b=new Boolean(b);b.ogg=a.canPlayType('video/ogg; codecs="theora"');
b.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"')||a.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');b.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"')}return b};d.audio=function(){var a=e.createElement("audio"),b=!!a.canPlayType;if(b){b=new Boolean(b);b.ogg=a.canPlayType('audio/ogg; codecs="vorbis"');b.mp3=a.canPlayType("audio/mpeg;");b.wav=a.canPlayType('audio/wav; codecs="1"');b.m4a=a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")}return b};d.localstorage=function(){try{return"localStorage"in
i&&i.localStorage!==null}catch(a){return false}};d.sessionstorage=function(){try{return"sessionStorage"in i&&i.sessionStorage!==null}catch(a){return false}};d.webWorkers=function(){return!!i.Worker};d.applicationcache=function(){return!!i.applicationCache};d.svg=function(){return!!e.createElementNS&&!!e.createElementNS(v.svg,"svg").createSVGRect};d.inlinesvg=function(){var a=document.createElement("div");a.innerHTML="<svg/>";return(a.firstChild&&a.firstChild.namespaceURI)==v.svg};d.smil=function(){return!!e.createElementNS&&
/SVG/.test(O.call(e.createElementNS(v.svg,"animate")))};d.svgclippaths=function(){return!!e.createElementNS&&/SVG/.test(O.call(e.createElementNS(v.svg,"clipPath")))};for(var H in d)if(R(d,H)){w=H.toLowerCase();f[w]=d[H]();P.push((f[w]?"":"no-")+w)}f.input||S();f.crosswindowmessaging=f.postmessage;f.historymanagement=f.history;f.addTest=function(a,b){a=a.toLowerCase();if(!f[a]){b=!!b();l.className+=" "+(b?"":"no-")+a;f[a]=b;return f}};j.cssText="";E=h=null;i.attachEvent&&function(){var a=e.createElement("div");
a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function c(p){for(var m=-1;++m<r;)p.createElement(g[m])}function k(p,m){for(var I=p.length,t=-1,y,J=[];++t<I;){y=p[t];m=y.media||m;J.push(k(y.imports,m));J.push(y.cssText)}return J.join("")}var g="abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video".split("|"),r=g.length,x=RegExp("<(/*)(abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video)",
"gi"),T=RegExp("\\b(abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video)\\b(?!.*[;}])","gi"),z=b.createDocumentFragment(),A=b.documentElement,K=A.firstChild,B=b.createElement("style"),C=b.createElement("body");B.media="all";c(b);c(z);a.attachEvent("onbeforeprint",function(){for(var p=-1;++p<r;)for(var m=b.getElementsByTagName(g[p]),I=m.length,t=-1;++t<I;)if(m[t].className.indexOf("iepp_")<0)m[t].className+=" iepp_"+
g[p];K.insertBefore(B,K.firstChild);B.styleSheet.cssText=k(b.styleSheets,"all").replace(T,".iepp_$1");z.appendChild(b.body);A.appendChild(C);C.innerHTML=z.firstChild.innerHTML.replace(x,"<$1bdo")});a.attachEvent("onafterprint",function(){C.innerHTML="";A.removeChild(C);K.removeChild(B);A.appendChild(z.firstChild)})}(this,document);f._enableHTML5=true;f._version="1.6";l.className=l.className.replace(/\bno-js\b/,"")+" js";l.className+=" "+P.join(" ");return f}(this,this.document);