var m;

$(function(){
	m = new iMap.Map({
		target_id: 'map',
		map_svg: mapSvg,
		data_url: dataJson,
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
			"margin": 5,
			"id": m.generateId(),
			"new": true,
			"changed": true
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

		new_station.setDataParam('changed', true);

		new_station.setDataParam('x', new_station.getGroup().getBBox().x2);
		new_station.setDataParam('y', new_station.getGroup().getBBox().y2);

		m.getStations().push(new_station);
	});

	$('#seditor-upload').on('click', function(e){
		e.preventDefault();

		if(confirm('are you sure to upload?')){
			$.ajax({
				url: 'json.php',
				type: 'post',
				data: {
					json: JSON.stringify(m.getStationsData())
				},
				beforeSend: function(){
					$('body').append('<div class="loading"><div>Loading...</div></div>');
				},
				success: function(){
					$('.loading').remove();
				}
			})
		}
	});
});