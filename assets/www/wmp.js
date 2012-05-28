(function(){
	var win = window;
	var mousePressed = false;

	/**
	 * @class Dummy Implementation of the W3C Touch object (Level 1)
	 */
	var Touch = function (e, id) {

		this.clientX = e.clientX;
		this.clientY = e.clientY;
		this.pageX = e.pageX;
		this.pageY = e.pageY;
		this.screenX = e.screenX;
		this.screenY = e.screenY;

		// TODO identifier übermitteln
		this.identifier = id;
		this.target = document.elementFromPoint(this.pageX, this.pageY);

		/**
		 * These can be seen in chrome touch emulation, not sure if they will be required for WebView

		this.webkitForce = 1;
		this.webkitRadiusX= 1;
		this.webkitRadiusY= 1
		this.webkitRotationAngle = 0;

		*/
	}

	/**
	 * @class Dummy Implementation of the W3C TouchList object (Level 1)
	 */
	function TouchList (touches, touchesLength) {

		for (var i = 0; i < touchesLength; i++)
			this[i] = touches[i];

		this.length = touchesLength;
		function identifiedTouch (id) {
			self.item = function item() {
				return this.item.id;
			};
			return this[id];
		}
	};

	TouchList.prototype.item = function item (){
			return this._value;
	
	};

	wmp = {
		isTouchDevice: true,
		mapMouseToTouch: {
			mousedown: 'touchstart',
			mousemove: 'touchmove',
			mouseup: 'touchend'
		},
		checkTouchDevice: function(){
			try{
				document.createEvent("TouchEvent");
				return true;
			}catch(e){
				return false;
			}
		},
		mouseListener: function(e) {
			if (e.type == 'mousemove' && !mousePressed)
				return;
			else {
				if (e.type == 'mousedown')
					mousePressed = true;
				else if (e.type == 'mouseup')
					mousePressed = false;
			}


			var eventType = wmp.mapMouseToTouch[e.type];
			var touch = new Touch(e, 0);
			wmp._raiseEvent(touch.target, eventType, [touch] );
		},
		_raiseEvent: function(el, eType, touches) {

			if (this.isTouchDevice)
				;
			else {
				// following two functions should ideally be TouchEvent, but Webkit only knows UIEvent (which also does the job)
				var evt = document.createEvent('UIEvent');
				evt.initUIEvent(eType, true, true);
			}

			// Generate Touchlist
			var touchList = new TouchList(touches, eType == 'touchend' ? 0 : 1);

			// attach TouchEvent-Attributes not in UIEvent by default
			evt.altKey = false;
			evt.ctrlKey = false;
			evt.metaKey = false;
			evt.shiftKey = false;
			evt.view = win;

			/** todo polyfill with multi-events */
			evt.changedTouches = touchList;
			evt.targetTouches = touchList;
			evt.touches = touchList;

//			evt.preventDefault();
			el.dispatchEvent(evt);
		}
	}

	// initialisation
	wmp.isTouchDevice = wmp.checkTouchDevice();
	if (!wmp.isTouchDevice)
	{
		addEventListener('mousedown', wmp.mouseListener, true);
		addEventListener('mouseup', wmp.mouseListener, true);
		addEventListener('mousemove', wmp.mouseListener, true)
	}


	win.wmp = wmp;
	win.wmp.prototype = {
		Touch: Touch,
		TouchList: TouchList
	};

})();


