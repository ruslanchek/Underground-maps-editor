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
					_station.disableEdit(s);
				}
			});

			if(station.isSelected()){
				station.disableEdit(s);
			}else{
				station.enableEdit(s);
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

	$('#seditor-add-bar').on('click', function(){
		var data = {
			"color": "#ff0000",
			"x": 50,
			"y": 50,
			"type": "circle",
			"rotate": 0,
			"text_side": "right",
			"name": "New station",
			"margin": 5,
			"id": "53da3bc34c5073a0174f9123123213212226d3"
		};

		m.getStations().push(new SStation(m.getSnap(), data, {
			on_click_enabled: m.options.station_on_click_enabled,

			onMouseOver: function(station){
				m.options.onStationMouseOver(station, m.getSnap());
			},

			onMouseOut: function(station){
				m.options.onStationMouseOut(station, m.getSnap());
			},

			onSelect: function(station){
				m.options.onStationSelect(station, m.getSnap());
			},

			onUnselect: function(station){
				m.options.onStationUnselect(station, m.getSnap());
			},

			onClick: function(station){
				m.options.onStationClick(station, m.getSnap());
			},

			onDblClick: function(station){
				m.options.onStationDblClick(station, m.getSnap());
			}
		}, m));
	});
});