var SShape = function(s, data){
	var shape = null;

	function createCircle(){
		var shape = s.circle(data.x, data.y, config.circle_radius);

		shape.attr({
			fill: config.shape_idle_fill_color,
			stroke: data.color,
			strokeWidth: config.circle_stroke_width,
			cursor: 'pointer'
		});

		return shape;
	}

	function createBar(){
		var shape = s.rect(data.x, data.y, config.bar_width, config.bar_height);

		shape.attr({
			fill: data.color,
			cursor: 'pointer'
		});

		var t = new Snap.Matrix().rotate(data.rotate, data.x + 2, data.y + 2);

		shape.transform(t);

		return shape;
	}

	function createEnd(){
		var shape = s.rect(data.x, data.y, config.end_width, config.end_height);

		shape.attr({
			fill: data.color,
			cursor: 'pointer'
		});

		return shape;
	}

	function create(){
		switch(data.type){
			case 'circle' : {
				shape = createCircle();
			} break;

			case 'bar' : {
				shape = createBar();
			} break;

			case 'end' : {
				shape = createEnd();
			} break;
		}
	}

	create();

	this.getShape = function(){
		return shape;
	};
};