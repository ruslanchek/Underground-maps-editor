iMap.Station.prototype.deleteStation = function(){
	if(confirm('Are you sure to delete?')){
		m.unsetCurrentStation();

		$('#edit').hide();
		$('#add').show();

		this.getGroup().remove();

		this.getData().delete = true;
	}
};

iMap.Station.prototype.enableEdit = function(s){
	m.setCurrentStation(this);

	var current_data = $.extend({}, this.getData());

	function save(station){
		console.station
		station.setDataParam('name', $('#seditor-name').val());
		station.setDataParam('color', $('#seditor-color').val());
		station.setDataParam('margin', parseInt($('#seditor-margin').val()));
		station.setDataParam('text_side', $('#seditor-text_side').val());
		station.setDataParam('rotate', parseInt($('#seditor-rotate').val()));
		station.setDataParam('changed', true);

		station.renewData();
	}

	function cancel(station){
		station.setDataParam('x', current_data.x);
		station.setDataParam('y', current_data.y);
		station.setDataParam('name', current_data.name);
		station.setDataParam('color', current_data.color);
		station.setDataParam('margin', current_data.margin);
		station.setDataParam('text_side', current_data.text_side);
		station.setDataParam('rotate', current_data.rotate);
		station.setDataParam('changed', false);

		station.renewData();
	}

	function edit(station){
		$('#edit').show();
		$('#add').hide();

		$('#seditor-color-preview').css({
			backgroundColor: station.getDataParam('color')
		});

		$('#seditor-id').val(station.getDataParam('id'));

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

	group.cx = 0;
	group.cy = 0;
	group.ox = 0;
	group.oy = 0;

	group.drag(dragging, startDrag, function(evt) {

	});

	function startDrag(posx, posy) {
		this.ox = posx - this.cx;
		this.oy = posy - this.cy;
	}

	function dragging(dx, dy, posx, posy) {
		group.cx = posx - group.ox;
		group.cy = posy - group.oy;

		var t = 't' + group.cx + ',' + group.cy;

		group.transform(t);

		station.setDataParam('x', current_data.x + group.cx);
		station.setDataParam('y', current_data.y + group.cy);

		console.log(station.getDataParam('x'),station.getDataParam('y'))
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

			x = x + group.cx;
			y = y + group.cy;

			startDrag(x, y);
			dragging(0, 0, x, y);

			if($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
				e.preventDefault();
				return false;
			}
		});

};

iMap.Station.prototype.disableEdit = function(s){
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

iMap.Map.prototype.setStationsOffset = function(x, y){
	var stations = this.getStations();

	for (var i = 0; i < stations.length; i++) {
		var station = stations[i];

		station.setDataParam('x', station.getDataParam('x') + x);
		station.setDataParam('y', station.getDataParam('y') + y);
		station.setDataParam('changed', true);

		station.renewData();
	}
};

iMap.Map.prototype.setCurrentStation = function(station){
	this.current_station = station;
};

iMap.Map.prototype.unsetCurrentStation = function(){
	this.current_station = null;
};

iMap.Map.prototype.getCurrentStation = function(){
	return this.current_station;
};

iMap.Map.prototype.getStationsData = function(){
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

iMap.Map.prototype.getChangedStations = function(){
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

iMap.Map.prototype.getChangedStationsData = function(){
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

iMap.Map.prototype.generateId = function(){
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	var g = guid();

	if(this.getStationById(g)){
		return this.generateId();
	}

	return g;
};
