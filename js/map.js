var config = {
    text_idle_fill_color  : 'rgba(0, 0, 0, 1)',

    shape_idle_fill_color : 'rgba(0, 0, 0, 0)',
    selected_color        : 'rgba(240, 0, 0, 1)',

    hover_color           : 'rgba(200, 0, 0, 1)',
    hover_selected_color  : 'rgba(220, 0, 0, 1)',

    bar_width             : 7,
    bar_height            : 7,

    bar_width_selected    : 7,
    bar_height_selected   : 7,

    end_width             : 21,
    end_height            : 7,

    end_width_selected    : 21,
    end_height_selected   : 7,

    circle_radius         : 7,
    circle_stroke_width   : 5,
    circle_stroke_width_selected: 5
};

var SMap = function(options) {
    var _this = this,
        stations = [];

    this.options = $.extend({
        selector: '',
        map_svg: '',
        data_url: '',
        min_zoom: 0.75,
        max_zoom: 1,
        zoom_animation_time: 500,
        station_on_click_enabled: true,
        onLoad: function(){

        },
        onStationClick: function(station, s){

        },
        onStationMouseOver: function(station, s){

        },
        onStationMouseOut: function(station, s){

        },
        onStationSelect: function(station, s, from_bind){

        },
        onStationUnselect: function(station, s, from_bind){

        },
        onStationDblClick: function(station, s){

        }
    }, options);

    var $container = $(this.options.selector),
        s = null;

    function draw() {
        s = Snap(_this.options.selector);

        Snap.load(_this.options.map_svg, function(data) {
            s.append(data);

            loadStations(function(){
                s.zpd({
                    zoom: false,
                    pan: true,
                    drag: false
                });

                zoomInit(function(){
                    _this.options.onLoad();
                });
            });
        });
    }

    function zoomInit (done){
        s.zoomTo(_this.options.min_zoom, 0, mina.easeinout);

        setTimeout(function(){
            s.panTo(-73, -70);
        }, 100);
    }

    function drawStation(data){
        stations.push(new SStation(s, data, {
            on_click_enabled: _this.options.station_on_click_enabled,

            onMouseOver: function(station){
                _this.options.onStationMouseOver(station, s);
            },

            onMouseOut: function(station){
                _this.options.onStationMouseOut(station, s);
            },

            onSelect: function(station, from_bind){
                _this.options.onStationSelect(station, s, from_bind);
            },

            onUnselect: function(station, from_bind){
                _this.options.onStationUnselect(station, s, from_bind);
            },

            onClick: function(station){
                _this.options.onStationClick(station, s);
            },

            onDblClick: function(station){
                _this.options.onStationDblClick(station, s);
            }
        }, _this));
    }

    function loadStations(done){
        $.ajax({
            url: _this.options.data_url,
            type: 'get',
            dataType: 'json',
            success: function(data){
                for (var i = 0; i < data.length; i++) {
                    drawStation(data[i]);
                }

                if(done) done();
            }
        })
    }

    // Public methods
    this.zoomOut = function(immediately){
        s.zoomTo(this.options.max_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){

        });

    };

    this.zoomIn = function(immediately){
        s.zoomTo(this.options.min_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){
            s.panTo(-73, -70, _this.options.zoom_animation_time, mina.easeinout);
        });
    };

    this.getStations = function(){
        return stations;
    };

    this.getStationById = function(id){
        for (var i = 0; i < stations.length; i++) {
            var obj = stations[i];

            if(obj.getData().id == id){
                return obj;
            }
        }
    };

    this.unselectAllStations = function(){
        for (var i = 0; i < stations.length; i++) {
            stations[i].unselect();
        }
    };

    this.iterateAllStations = function(done){
        for (var i = 0; i < stations.length; i++) {
            if(done) done(stations[i]);
        }
    };

    this.init = function() {
        draw();
    };

    this.getSnap = function(){
        return s;
    };
};