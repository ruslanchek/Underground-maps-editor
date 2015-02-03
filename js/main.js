var m;

$(function(){
	var stations = [];

	var ractive = new Ractive({
		el: '#stations',
		template: '#template',
		data: {
			stations: stations
		}
	});

	function deleteStation(data){
		var arr = [];

		for (var i = 0; i < stations.length; i++) {
			var obj = stations[i];

			if(obj.id != data.id){
				arr.push(obj);
			}
		}

		stations = arr;

		ractive.set('stations', stations);
	}

	function addStation(data){
		var in_arr = false;

		for (var i = 0; i < stations.length; i++) {
			var obj = stations[i];

			if(obj.id == data.id){
				in_arr = true;
			}
		}

		if(!in_arr){
			stations.push(data);
		}

		ractive.set('stations', stations);
	}

	m = new iMap.Map({
		target_id: 'map',
		map_svg: mapSvg,
		data_url: dataJson,
		viewport_width: can_w,
		viewport_height: can_h,
		map_width: map_w,
		map_height: map_h,
		min_zoom: 0.68,
		onStationSelect: function(station, s, from_bind){
			if(!from_bind) {
				addStation(station.getData());
			}
		},
		onStationUnselect: function(station, s, from_bind){
			if(!from_bind) {
				deleteStation(station.getData());
			}
		}
	});

	m.init();

	$('.zoomer').on('click', function(e){
		e.preventDefault();

		if($(this).hasClass('active')){
			$(this).removeClass('active');

			m.zoomIn();
		}else{
			$(this).addClass('active');

			m.zoomOut();
		}
	});
});