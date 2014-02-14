var MAIN = MAIN || {};

/* DEFINITIONS */
MAIN.views= MAIN.views || {};
MAIN.utils = MAIN.utils || {};
MAIN.modules = MAIN.modules || {};




/* HOME CONTROLLER */
MAIN.views.home = function ( $, undefined ) {
	var instance = null;

	var $wrapper = $('.wrapper'),
		$iframe = $('iframe'),
		$grid = $('.grid'),
		$gridUl = $grid.find('ul'),
		$control = $('#control'),
		$column = $('#column'),
		$gutter = $('#gutter'),
	 	$pageMargin = $('#page-margin'),
		$url = $('#url'),
		$deviceHeight = $('#device-height'),
		$deviceWidth = $('#device-width');



	function updateGrid() {
		/*$column.on('keyup', function (e) {
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
		})*/


		$column[0].oninput = function (e) {
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

		function getValue (thisValue) {
			var value = thisValue;
			if(value.match(/\d\.?\d*(%|\s*px)?/) && value !== '') {
				var unit = value.match(/%/)?'%':'px',
					gutterNum = parseFloat(value.replace('px',''));

				console.log(value, gutterNum, unit);
				return {
					gutterNum: gutterNum,
					unit: unit
				}
			}

			return null;
		}

		$gutter[0].oninput = function (e) {
			var value = getValue(this.value);
			if(value) {
				$gridUl.find('li').css({
					'padding' :'0 ' + value.gutterNum/2 + value.unit
				})
			}
		};

		$pageMargin[0].oninput = function (e) {
			var value = getValue(this.value);
			if(value) {
				$gridUl.css({
					'margin' :'0 ' + value.gutterNum + value.unit
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

		$url.on('keyup',function (e) {
			console.log(e);
			if(e.keyCode === 13) {
				setURL(this.value);
			}
		})

		$('#enter-url').on('click', function (e) {
			e.preventDefault();
			setURL($url[0].value);
		})
	}

	function updateWindowSize( screenWidth, screenHeight) {
		if(screenWidth && screenHeight) {
			$wrapper.css({
				width: screenWidth,
				height: screenHeight
			})

			$deviceHeight[0].value = screenHeight;
			$deviceWidth[0].value = screenWidth;
		}
		if(screenWidth) {
			$wrapper.css({
				width: screenWidth
			})
			$deviceWidth[0].value = screenWidth;
		}
		if(screenHeight) {
			$wrapper.css({
				height: screenHeight
			})

			$deviceHeight[0].value = screenHeight;
		}
			
	}

	function filterDevice (elements, value) {
		console.log( value);
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
			$deviceWidth[0].value = e.pageX - 10;

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

		$deviceWidth.on('keyup', function (e) {
			if(this.value!== '') {
				updateWindowSize(this.value, null)
			}
				
		})

		$deviceHeight.on('keyup', function (e) {
			if(this.value!== '') {
				updateWindowSize(null, this.value)
			}
		})

		$('#rotate').on('click', function(e) {
			e.preventDefault();
			updateWindowSize($deviceHeight[0].value, $deviceWidth[0].value);
		})

		var showGrid = true;
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
		updateWindowSize();
		resizeViewport ();
		controlPanel ();

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
