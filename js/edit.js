var m;

$(function(){
	m = new SMap({
		selector: '#map',
		map_svg: 'img/moscow.svg',
		data_url: 'moscow.json',
		min_zoom: 0.68,
		station_on_click_enabled: false,
		onStationDblClick: function(station, s){
			m.iterateAllStations(function(_station){
				if(_station.getData().id != station.getData().id){
					_station.disableDrag(s);
				}
			});

			if(station.isSelected()){
				station.disableDrag(s);
			}else{
				station.enableDrag(s);
			}
		},
		onStationSelect: function(station, s){

		},
		onStationUnselect: function(station, s){

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