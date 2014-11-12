SStation.prototype.enableDrag = function(s){
	s.zpd({
		zoom: false,
		pan: false,
		drag: false
	});

	this.select();

	var group = this.getGroup(),
		station = this,
		drag_data = this.drag_data || {};

	drag_data.lx = 0;
	drag_data.ly = 0;
	drag_data.ox = 0;
	drag_data.oy = 0;

	function moveFnc(dx, dy) {
		drag_data.lx = dx + drag_data.ox;
		drag_data.ly = dy + drag_data.oy;

		group.transform('t' + drag_data.lx + ',' + drag_data.ly);
	}

	function startFnc(x, y, e) {  }

	function endFnc() {
		drag_data.ox = drag_data.lx;
		drag_data.oy = drag_data.ly;

		station.setDataParam('x', station.getDataParam('x') + drag_data.ox);
		station.setDataParam('y', station.getDataParam('y') + drag_data.oy);
	}

	$('body')
		.off('keydown.moveStation')
		.off('keyup.moveStation')
		.on('keydown.moveStation', function(e){
			e.preventDefault();
			return false;
		}).on('keyup.moveStation', function(e){
			e.preventDefault();

			var x = 0,
				y = 0,
				multiplier = 1;

			if(e.shiftKey && !e.altKey){
				multiplier = 10;
			}

			if(e.altKey && !e.shiftKey){
				multiplier = 0.5;
			}

			switch(e.keyCode){
				case 38 : { // up
					y -= multiplier;
				} break;

				case 39 : { // right
					x += multiplier;
				} break;

				case 40 : { // down
					y += multiplier;
				} break;

				case 37 : { // left
					x -= multiplier;
				} break;
			}

			drag_data.lx = x + drag_data.ox;
			drag_data.ly = y + drag_data.oy;

			moveFnc(x, y);
			endFnc();

			return false;
		});

	group.drag(moveFnc, startFnc, endFnc);
};

SStation.prototype.disableDrag = function(s){
	$('body').off('keydown.moveStation').off('keyup.moveStation');

	s.zpd({
		zoom: false,
		pan: true,
		drag: false
	});

	this.unselect();

	var group = this.getGroup();

	group.drag(false, false, false);
};