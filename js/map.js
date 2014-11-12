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

    end_width             : 19,
    end_height            : 7,

    end_width_selected    : 19,
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
        onLoad: function(){

        },
        onStationClick: function(station){

        },
        onStationMouseOver: function(station){

        },
        onStationMouseOut: function(station){

        },
        onStationSelect: function(station){

        },
        onStationUnselect: function(station){

        }
    }, options);

    var $container = $(this.options.selector),
        s = null;

    function onLoad(){
        _this.options.onLoad();
    }

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
                    onLoad();
                });
            });
        });
    }

    function zoomInit (done){
        if(done) done();
    }

    function drawStation(data){
        stations.push(new SStation(s, data, {
            onMouseOver: function(station){
                _this.options.onStationMouseOver(station);
            },
            onMouseOut: function(station){
                _this.options.onStationMouseOut(station);
            },
            onSelect: function(station){
                _this.options.onStationSelect(station);
            },
            onUnselect: function(station){
                _this.options.onStationUnselect(station);
            },
            onClick: function(station){
                _this.options.onStationClick(station);
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
        s.zoomTo(this.options.max_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout);
    };

    this.zoomIn = function(immediately){
        s.zoomTo(this.options.min_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout);
    };

    this.getStations = function(){
        return stations;
    };

    this.stationsConv = function(){
        var a = [];

        for (var i = 0; i < stations.length; i++) {
            var obj = stations[i].getData();

            if(obj.type == 'bar'){
                obj.x = obj.x - 2;
                obj.y = obj.y - 2;
            }

            a.push(obj);
        }

        console.log(JSON.stringify(a))
    };

    this.getStationById = function(id){
        for (var i = 0; i < stations.length; i++) {
            var obj = stations[i];

            if(obj.getData().id == id){
                return obj;
            }
        }
    };

    this.init = function() {
        draw();
    };
};


