var SText = function(s, data, shape){
	this.empty = false;

	if(!data.name){
		this.empty = true;
		return;
	}

	var _this = this,
		text = null,
		bg = null,
		snap_offset_x = 2,
		snap_offset_y = 0;

	function getSnapCoords(){
		var x = 0,
			y = 0,
			text_bb = text.getBBox(),
			shape_bb = shape.getBBox(),
			offset = 3;

		switch(data.text_side){
			case 'top' : {
				x = shape_bb.cx - text_bb.width / 2 + offset;
				y = shape_bb.y - offset - data.margin;
			} break;

			case 'right' : {
				x = shape_bb.x2 + offset + data.margin;
				y = shape_bb.cy + text_bb.height / 4;
			} break;

			case 'bottom' : {
				x = shape_bb.cx - text_bb.width / 2 + offset;
				y = shape_bb.y2 + text_bb.height - offset + data.margin;
			} break;

			case 'left' : {
				x = shape_bb.x - text_bb.width + offset * 3 - data.margin;
				y = shape_bb.cy + text_bb.height / 4;
			} break;
		}

		return {
			x: x,
			y: y
		}
	}

	function createBg(){
		bg = s.rect(0, 0, 0, 0);

		bg.attr({
			fill: 'rgba(255, 255, 255, 0.75)',
			cursor: 'pointer'
		});
	}

	function snapBg(){
		var bb = text.getBBox(),
			x = bb.x - snap_offset_x,
			y = bb.y - snap_offset_y,
			w = bb.width + snap_offset_x * 2,
			h = bb.height + snap_offset_y * 2;

		bg.attr({
			x: x,
			y: y,
			width: w,
			height: h
		});
	}

	function createTextAndBg(){
		createBg(); // todo: СДЕЛАТЬ ОПЦИЮ, ЧТОБЫ ГРУЗИТЬ/НЕ ГРУЗИТЬ ФОН ПРОЗРАЧНЫЙ

		text = s.text(0, 0, data.name);

		var coords = getSnapCoords();

		text.attr({
			x: coords.x,
			y: coords.y,
			fontSize: 14,
			cursor: 'pointer'
		});

		snapBg();
	}

	this.getText = function(){
		return text;
	};

	this.getBg = function(){
		return bg;
	};

	createTextAndBg();
};

