SStation.prototype.deleteStation = function(){
	if(confirm('Are you sure to delete?')){
		m.unsetCurrentStation();

		$('#edit').hide();
		$('#add').show();

		this.getGroup().remove();

		this.getData().delete = true;
	}
};

SStation.prototype.enableEdit = function(s){
	m.setCurrentStation(this);

	var current_data = $.extend({}, this.getData());

	function save(station){
		station.setDataParam('name', $('#seditor-name').val());
		station.setDataParam('color', $('#seditor-color').val());
		station.setDataParam('margin', parseInt($('#seditor-margin').val()));
		station.setDataParam('text_side', $('#seditor-text_side').val());
		station.setDataParam('rotate', parseInt($('#seditor-rotate').val()));
		station.setDataParam('changed', true);

		station.renewData();
	}

	function cancel(station){
		station.setDataParam();
	}

	function edit(station){
		$('#edit').show();
		$('#add').hide();

		$('#seditor-color-preview').css({
			backgroundColor: station.getDataParam('color')
		});

		$('#seditor-name').val(station.getDataParam('name')).off('keyup').on('keyup', function(){
			station.setDataParam('name', $(this).val());
			station.renewData();
		});

		$('#seditor-color').val(station.getDataParam('color')).off('keyup').on('keyup', function(){
			station.setDataParam('color', $(this).val());
			$('#seditor-color-preview').css({
				backgroundColor: station.getDataParam('color')
			});
			station.renewData();
		});

		$('#seditor-margin').val(station.getDataParam('margin')).off('keyup').on('keyup', function(){
			station.setDataParam('margin', $(this).val());
			station.renewData();
		});

		$('#seditor-rotate').val(station.getDataParam('rotate')).off('keyup').on('keyup', function(){
			station.setDataParam('rotate', $(this).val());
			station.renewData();
		});

		$('#seditor-text_side').find('option[value="'+station.getDataParam('text_side')+'"]').attr('selected', 'selected');
		$('#seditor-text_side').off('select change').on('select change', function(){
			station.setDataParam('text_side', $(this).val());
			station.renewData();
		});

		$('#seditor-edit-close').off('click').on('click', function(e){
			e.preventDefault();
			cancel(station);
			station.disableEdit(s);
		});

		$('#seditor-delete').off('click').on('click', function(e){
			e.preventDefault();
			station.deleteStation();
			station.disableEdit(s);
		});

		$('#seditor-submit').off('click').on('click', function(e){
			e.preventDefault();
			save(station);
			station.disableEdit(s);
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
		station = this;

	var drag_data = {};

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

		console.log(current_data.y, drag_data.ly)

		station.setDataParam('x', current_data.x + drag_data.lx);
		station.setDataParam('y', current_data.y + drag_data.ly);
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
					save();
					station.disableEdit(s);
				} break;

				case 27 : { // left
					station.disableEdit(s);
					cancel();
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
	m.unsetCurrentStation();

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
		station.setDataParam('changed', true);

		station.renewData();
	}
};

SMap.prototype.setCurrentStation = function(station){
	this.current_station = station;
};

SMap.prototype.unsetCurrentStation = function(){
	this.current_station = null;
};

SMap.prototype.getCurrentStation = function(){
	return this.current_station;
};

SMap.prototype.getStationsData = function(){
	var stations = this.getStations(),
		datas = [];

	for (var i = 0; i < stations.length; i++) {
		var station = stations[i],
			data = station.getData();

		delete data.changed;
		delete data.new;

		if(data.delete !== true) {
			datas.push(data);
		}
	}

	return datas;
};

SMap.prototype.getChangedStations = function(){
	var stations = this.getStations(),
		changed = [];

	for (var i = 0; i < stations.length; i++) {
		var station = stations[i],
			data = station.getData();

		if(data.changed === true && data.delete !== true){
			changed.push(station);
		}
	}

	return changed;
};

SMap.prototype.getChangedStationsData = function(){
	var stations = this.getChangedStations(),
		datas = [];

	for (var i = 0; i < stations.length; i++) {
		var station = stations[i],
			data = station.getData();

		delete data.changed;
		delete data.new;

		if(data.delete !== true) {
			datas.push();
		}
	}

	return datas;
};

SMap.prototype.generateId = function(){
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return function() {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		};
	}

	var g = guid();

	if(this.getStationById(g)){
		return this.generateId();
	}

	return g;
};
