var m,
	changed_stations,
	current_station;

$(function(){
	m = new SMap({
		selector: '#map',
		map_svg: 'img/moscow_1.svg',
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

	$('.seditor-add').on('click', function(e){
		e.preventDefault();

		var data = {
			"color": "#ff0000",
			"x": 50,
			"y": 50,
			"type": $(this).data('type'),
			"rotate": 0,
			"text_side": "right",
			"name": "New station",
			"margin": 5
		};

		var new_station = new SStation(m.getSnap(), data, {
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
		}, m);

		m.getStations().push(new_station);
		changed_stations.push(new_station);
	});

	$('#seditor-upload').on('click', function(e){
		e.preventDefault();

		if(confirm('are you sure to upload?')){

		}
	});
});