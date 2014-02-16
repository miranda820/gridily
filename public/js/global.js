var MAIN = MAIN || {};

/* DEFINITIONS */
MAIN.views= MAIN.views || {};
MAIN.utils = MAIN.utils || {};
MAIN.modules = MAIN.modules || {};

MAIN.utils.getValue = function (thisValue) {
	var value = thisValue;

	if(value.match(/\d\.?\d*(%|\s*px)?/) && value !== '') {
		var unit = value.match(/%/)?'%':'px',
			num = parseFloat(value.replace('px',''));
		return {
			num: num,
			unit: unit
		}
	}
	return null;
}

MAIN.modules.createGrid = function (options) {
		var $grid = $('.grid'),
			canvas = options.canvas;

		function getStyle (el,pseudo, property) {
			return window.getComputedStyle(el,pseudo).getPropertyValue(property);
		}
	
		var columnSetup = {
			pageMargin : getStyle($grid.find('ul')[0], null, 'margin-left'), 
			halfGuter : getStyle($grid.find('ul li')[0], null, 'padding-left'),
			columnWidth : getStyle($grid.find('ul li')[0],null, 'width')
		};
		//update each field with number
		for(size in columnSetup) {
			if(columnSetup.hasOwnProperty(size)) {
				if (columnSetup[size].match('px')) {
					columnSetup[size] = parseFloat(columnSetup[size]);
				} else {
					if (size === 'columnWidth' && columnSetup.pageMargin ){
						columnSetup[size] = (parseFloat(canvas.width) - 2 * columnSetup.pageMargin )* Math.round(parseFloat(columnSetup[size])*100)/10000;
					} else {
						columnSetup[size] = parseFloat(canvas.width) * Math.round(parseFloat(columnSetup[size])*100)/10000;
					}
				}
			}
		}
	//create grid on canvas	
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect (0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
		ctx.fillRect (0, 0, canvas.width, canvas.height);

		//create gutter and column
		function halfGutter (options) {
			ctx.fillStyle = 'rgba(0, 10, 255, .15)';
			ctx.fillRect (options.x, 0, options.width, canvas.height);				
		}

		function column (options) {
			ctx.fillStyle = 'rgba(255, 0, 0, 0.45)';
			ctx.fillRect (options.x, 0, options.width, canvas.height);		
		}

		var totalColumn =  options.totalColumn;

		for (var i = 0; i < totalColumn; i++) {
			halfGutter({
				x : columnSetup.pageMargin + i * columnSetup.columnWidth,
				width: columnSetup.halfGuter
			})

			column({
				x: columnSetup.pageMargin + columnSetup.halfGuter + i * columnSetup.columnWidth,
				width: columnSetup.columnWidth - 2 * columnSetup.halfGuter
			})

			halfGutter({
				x : columnSetup.pageMargin + columnSetup.columnWidth - columnSetup.halfGuter + i * columnSetup.columnWidth,
				width: columnSetup.halfGuter
			})
		}

		return canvas.toDataURL("image/png");

	}
}


/* HOME CONTROLLER */
MAIN.views.home = function ( $, undefined ) {
	var instance = null;

	var $wrapper = $('.wrapper'),
		canvas = document.getElementById('create-grid'),
		columnInput = document.getElementById('column'),
		gutterInput = document.getElementById('gutter'),
		pageMargin = document.getElementById('page-margin'),
		deviceHeight = document.getElementById('device-height'),
		deviceWidth = document.getElementById('device-width'),
		url = document.getElementById('url'),
		$iframe = $('iframe'),
		$gridUl = $('.grid ul');



	function updateGrid() {

		columnInput.oninput = function (e) {
			if(this.value.match(/[0-9]+/) && this.value !== 0) {
				var columnNum = this.value,
					markup ='';
				for (var i = 0; i < columnNum; i ++) {
					markup += '<li></li>';
				}
				var columns = $(markup).css({
					width : 100/columnNum + '%'
				})
				$gridUl.html(columns);
			}

			return
		}

		gutterInput.oninput = function (e) {
			var value = MAIN.utils.getValue(this.value);
			if(value) {
				$gridUl.find('li').css({
					'padding' :'0 ' + value.num/2 + value.unit
				})
			}
		};

		pageMargin.oninput = function (e) {
			var value = MAIN.utils.getValue(this.value);
			if(value) {
				$gridUl.css({
					'margin' :'0 ' + value.num + value.unit
				})
			}
		};
	}

	function updateURL() {

		function setURL (value) {
			if(value.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)){
				$('iframe')[0].src = value;
			}
		}
		$(url).on('keyup', function (e) {
			console.log(e);
			if(e.keyCode === 13) {
				setURL(this.value);
			}
		});

		$('#enter-url').on('click', function (e) {
			e.preventDefault();
			setURL(url.value);
		})
	}

	function updateWindowSize( screenWidth, screenHeight) {
			$wrapper.css({
				width: screenWidth,
				height: screenHeight
			})

			canvas.width = screenWidth;
			canvas.height = screenHeight;

			deviceHeight.value = screenHeight;
			deviceWidth.value = screenWidth;
	}

	function filterDevice (elements, value) {
		elements.each(function(i) {
			
			var text = this.innerHTML.toLowerCase(),
				pattern = new RegExp(value);
			if(text.match(pattern)) {
				this.style.display ='block';
			} else {
				this.style.display ='none';
			}
		})
	}

	function resizeViewport () {

		function OnMouseMove (e) {

			console.log(e, e.pageX);
			$wrapper[0].style.width = e.pageX - 10 + 'px';
			canvas.width = e.pageX - 10;
			deviceWidth.value = e.pageX - 10;

		}

		$('#drag-left')[0].onmousedown = function (e) {
			document.addEventListener('mousemove', OnMouseMove, false);
			$iframe.css({
				'pointer-events':'none'
			})
		}

		document.onmouseup = function (e) {
			document.removeEventListener('mousemove', OnMouseMove, false);
			$iframe.css({
				'pointer-events':'auto'
			})
		}
	}

	function controlPanel () {
		var $mobileDevices = $('#mobile-devices .item'),
			$tabletDevices = $('#tablet-devices .item');

		$('#mobile-filter')[0].oninput = function (e) {
			filterDevice($mobileDevices, e.target.value.toLowerCase());
		};

		$('#tablet-filter')[0].oninput = function (e) {
			filterDevice($tabletDevices, e.target.value.toLowerCase());
		};

		$(deviceWidth).on('keyup', function (e) {
			if(this.value!== '') {
				updateWindowSize(this.value, deviceHeight.value)
			}
				
		})

		$(deviceHeight).on('keyup', function (e) {
			if(this.value!== '') {
				updateWindowSize(deviceWidth.value, this.value)
			}
		})

		$('#rotate').on('click', function(e) {
			e.preventDefault();
			updateWindowSize(deviceHeight.value, deviceWidth.value);
		})

		var showGrid = false;
		$('#toggle-grid').on('click', function(e){
			e.preventDefault();
			if(!showGrid) {
				this.innerHTML = '<i class="fa fa-minus-square"></i> Hide Grid';
				showGrid = true;
			} else {
				this.innerHTML = '<i class="fa fa-plus-square"></i> Show Grid';
				showGrid = false;
			}
			$('.grid').toggleClass('hide');
		})
		$('.item').on('click', function () {
			var screenWidth = $(this).data('width'),
				screenHeight = $(this).data('height');

			screenWidth = (screenWidth !== '')? screenWidth : 1200;
			screenHeight = (screenHeight !== '')? screenHeight : 1200;
			$(this).closest('.menu').addClass('hide');
			updateWindowSize(screenWidth, screenHeight)
		})

		$('.menu').mouseenter(function (e) {
			$(this).removeClass('hide');
		})
	}

	function construct( ) {

		updateGrid();
		updateURL();
		resizeViewport ();
		controlPanel ();

		$('#download-image').on('click', function (e) {
			e.preventDefault();

			var dataURl = MAIN.modules.createGrid({
				canvas: canvas,
				totalColumn: columnInput.value
			});
			
			var openWindow = window.open("","","width=1200,height=1200");
			openWindow.document.write('<image src="'+ dataURl +'" download="grid.png"/>');
		})

	}


	return {
		Init: construct
	};

};



/*  Bootstrap */
MAIN = (function ($) {

	var className = $('body').data('script');
	//execute the view
	if( typeof MAIN.views[className] === 'function') {
		MAIN.views[className](jQuery).Init();
	}

	return MAIN;
})(jQuery);