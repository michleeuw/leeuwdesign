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
