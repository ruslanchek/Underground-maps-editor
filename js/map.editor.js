SStation.prototype.deleteStation = function(){
	if(confirm('Are you sure to delete?')){
		current_station = null;

		$('#edit').hide();
		$('#add').show();

		this.getGroup().remove();

		this.getData().delete = true;
	}
};

SStation.prototype.enableEdit = function(s){
	current_station = this;

	function edit(station){
		$('#edit').show();
		$('#add').hide();

		$('#seditor-name').val(station.getDataParam('name'));
		$('#seditor-color').val(station.getDataParam('color'));
		$('#seditor-color-preview').css({
			backgroundColor: station.getDataParam('color')
		});
		$('#seditor-margin').val(station.getDataParam('margin'));
		$('#seditor-rotate').val(station.getDataParam('rotate'));

		$('#seditor-text_side').find('option[value="'+station.getDataParam('text_side')+'"]').attr('selected', 'selected');

		$('#seditor-edit-close').off('click').on('click', function(){
			station.disableEdit(s);
		});

		$('#seditor-delete').off('click').on('click', function(e){
			e.preventDefault();
			station.deleteStation();
		});

		$('#seditor-color').off('keyup keydown change focus blur').on('keyup keydown change focus blur', function(){
			$('#seditor-color-preview').css({
				backgroundColor: $(this).val()
			});
		});

		$('#seditor-submit').off('click').on('click', function(e){
			e.preventDefault();

			station.setDataParam('name', $('#seditor-name').val());
			station.setDataParam('color', $('#seditor-color').val());
			station.setDataParam('margin', parseInt($('#seditor-margin').val()));
			station.setDataParam('rotate', parseInt($('#seditor-rotate').val()));
			station.setDataParam('text_side', $('#seditor-text_side').val());

			station.renewData();
		});
	}

	edit(this);

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
			if($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
				e.preventDefault();
				return false;
			}
		}).on('keyup.moveStation', function(e){
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

				case 13 : { // left
					station.disableEdit(s);
				} break;

				case 27 : { // left
					station.disableEdit(s);
				} break;
			}

			drag_data.lx = x + drag_data.ox;
			drag_data.ly = y + drag_data.oy;

			moveFnc(x, y);
			endFnc();

			if($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
				e.preventDefault();
				return false;
			}
		});

	group.drag(moveFnc, startFnc, endFnc);
};

SStation.prototype.disableEdit = function(s){
	current_station = null;

	$('body').off('keydown.moveStation').off('keyup.moveStation');

	s.zpd({
		zoom: false,
		pan: true,
		drag: false
	});

	this.unselect();

	var group = this.getGroup();

	group.drag(false, false, false);

	$('#edit').hide();
	$('#add').show();
};

SMap.prototype.setStationsOffset = function(x, y){
	var stations = this.getStations();

	for (var i = 0; i < stations.length; i++) {
		var station = stations[i];

		station.setDataParam('x', station.getDataParam('x') + x);
		station.setDataParam('y', station.getDataParam('y') + y);

		station.renewData();
	}
};