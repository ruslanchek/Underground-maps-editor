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

	var m = new SMap({
		selector: '#map',
		map_svg: 'img/moscow.svg',
		data_url: 'moscow.json',
		min_zoom: 0.68,
		onStationSelect: function(station){
			addStation(station.getData());
		},
		onStationUnselect: function(station){
			deleteStation(station.getData());
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