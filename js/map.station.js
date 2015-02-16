var SStation = function(s, data, options, map_superclass){
	var _this = this,
		selected = false;

	// Normalize data
	data.x = parseFloat(data.x);
	data.y = parseFloat(data.y);
	data.rotate = parseInt(data.rotate);
	data.margin = parseInt(data.margin);

	var _shape = new SShape(s, data),
		_text = new SText(s, data, _shape.getShape()),
		group = null,
		shape = null,
		text = null,
		text_bg = null;

	this.options = $.extend({
		on_click_enabled: true,

		onClick: function(station_instance){

		},

		onSelect: function(station_instance){

		},

		onUnselect: function(station_instance){

		},

		onMouseOver: function(station_instance){

		},

		onMouseOut: function(station_instance){

		},

		onDblClick: function(station_instance){

		}
	}, options);

	function setTextAttrs(text, attrs){
		if(text) {
			text.attr(attrs);
		}
	}

	function colorLuminance(hex, lum) {
		hex = String(hex).replace(/[^0-9a-f]/gi, '');

		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}

		lum = lum || 0;

		var rgb = "#", c, i;

		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}

	function getHoverStyle(){
		switch(data.type){
			case 'bar': {
				return {
					fill: colorLuminance(data.color, -0.25),
					width: config.bar_width,
					height: config.bar_height
				}
			} break;

			case 'end': {
				return {
					fill: colorLuminance(data.color, -0.25),
					width: config.end_width,
					height: config.end_height
				}
			} break;

			case 'circle': {
				return {
					stroke:colorLuminance(data.color, -0.25)
				}
			} break;
		}
	}

	function getSelectedStyle(){
		switch(data.type){
			case 'bar': {
				return {
					fill: config.selected_color,
					width: config.bar_width_selected,
					height: config.bar_height_selected
				}
			} break;

			case 'end': {
				return {
					fill: config.selected_color,
					width: config.end_width_selected,
					height: config.end_height_selected
				}
			} break;

			case 'circle': {
				return {
					stroke: config.selected_color,
					fill: config.selected_color,
					strokeWidth: config.circle_stroke_width_selected
				}
			} break;
		}
	}

	function getSelectedHoverStyle(){
		switch(data.type){
			case 'bar': {
				return {
					fill: config.hover_selected_color,
					width: config.bar_width_selected,
					height: config.bar_height_selected
				}
			} break;

			case 'end': {
				return {
					fill: config.hover_selected_color,
					width: config.end_width_selected,
					height: config.end_height_selected
				}
			} break;

			case 'circle': {
				return {
					stroke: config.hover_selected_color,
					fill: config.hover_selected_color,
					strokeWidth: config.circle_stroke_width_selected
				}
			} break;
		}
	}

	function getNormalStyle(){
		switch(data.type){
			case 'bar': {
				return {
					fill: data.color,
					width: config.bar_width,
					height: config.bar_height
				}
			} break;

			case 'end': {
				return {
					fill: data.color,
					width: config.end_width,
					height: config.end_height
				}
			} break;

			case 'circle': {
				return {
					stroke: data.color,
					fill: config.shape_idle_fill_color,
					strokeWidth: config.circle_stroke_width
				}
			} break;
		}
	}

	function select(shape, text){
		selected = true;

		shape.attr(getSelectedStyle());

		setTextAttrs(text, {
			fill: config.selected_color
		});

		_this.selectBinded();
		_this.options.onSelect(_this);
	}

	function unselect(shape, text){
		selected = false;

		shape.attr(getNormalStyle());

		setTextAttrs(text, {
			fill: config.text_idle_fill_color
		});

		_this.unselectBinded();
		_this.options.onUnselect(_this);
	}

	function mouseOver(shape, text){
		if(selected){
			shape.attr(getSelectedHoverStyle());

			text.attr({
				fill: config.hover_selected_color
			});
		}else{
			shape.attr(getHoverStyle());

			setTextAttrs(text, {
				fill: config.hover_color
			});
		}

		_this.options.onMouseOver(_this);
	}

	function mouseOut(shape, text){
		if(selected){
			shape.attr(getSelectedStyle());

			text.attr({
				fill: config.selected_color
			});
		}else{
			shape.attr(getNormalStyle());

			setTextAttrs(text, {
				fill: config.text_idle_fill_color
			});
		}

		_this.options.onMouseOut(_this);
	}

	function createGroup(){
		shape = _shape.getShape();

		text_bg = _text.getBg();
		text = _text.getText();
		group = s.g(shape, text_bg, text);

		group.hover(function(){
			mouseOver(shape, text);
		}, function(){
			mouseOut(shape, text);
		});

		if(_this.options.on_click_enabled === true) {
			group.click(function () {
				if (selected) {
					unselect(shape, text);
				} else {
					select(shape, text);
				}

				_this.options.onClick(_this);
			});
		}

		group.dblclick(function(){
			_this.options.onDblClick(_this);
		});
	}

	this.selectBinded = function(){
		if(data.bind) {
			for (var i = 0; i < data.bind.length; i++) {
				var obj = data.bind[i],
					bs = map_superclass.getStationById(obj);

				if(bs && !bs.isSelected()){
					bs.select();
				}
			}
		}
	};

	this.unselectBinded = function(){
		if(data.bind) {
			for (var i = 0; i < data.bind.length; i++) {
				var obj = data.bind[i],
					bs = map_superclass.getStationById(obj);

				if(bs && bs.isSelected()){
					bs.unselect();
				}
			}
		}
	};

	this.select = function(){
		if(!selected){
			select(shape, text);
		}
	};

	this.unselect = function(){
		if(selected){
			unselect(shape, text);
		}
	};

	this.isSelected = function(){
		return selected;
	};

	this.getData = function(){
		return data;
	};

	this.getGroup = function(){
		return group;
	};

	this.setDataParam = function(param, value){
		data[param] = value;
	};

	this.getDataParam = function(param){
		return data[param];
	};

	this.renewData = function(){
		_text.changeText(data);
		shape.attr(getSelectedStyle());
	};

	createGroup();
};