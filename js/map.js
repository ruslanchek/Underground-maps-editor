var iMap = {};

iMap.config = {
    text_idle_fill_color  : 'rgba(120, 120, 120, 1)',
    text_idle_fill_hover_color  : 'rgba(80, 80, 80, 1)',

    text_selected_color   : 'rgba(0, 0, 0, 1)',
    text_selected_color_hover   : 'rgba(40, 40, 40, 1)',

    shape_idle_fill_color : 'rgba(255, 255, 255, 1)',
    selected_color        : 'rgba(0, 0, 0, 0)',

    hover_color           : 'rgba(0, 0, 0, 0)',
    hover_selected_color  : 'rgba(0, 0, 0, 0)',

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

iMap.Map = function(options) {
    var _this = this,
        stations = [],
        selectors = [];

    this.options = $.extend({
        target_id: '',
        map_svg: '',
        data_url: '',
        min_zoom: 0.75,
        viewport_width: false,
        viewport_height: false,
        map_width: false,
        map_height: false,
        offset_x: false,
        offset_y: false,
        max_zoom: 1,
        zoom_animation_time: 300,
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

    this.initialized = false;
    this.wrapper = false;

    var $container = $('#' + this.options.target_id),
        s = null;

    this.drawWraps = function(){
        var zoomer = '';

        if($.browser && !$.browser.mobile){
            zoomer = '<a href="#" class="zoomer" id="' + _this.options.target_id + '-zoomer"><i class="icon-font icon-font-zoom_in"></i></a>';
        }

        $container.html(
            '<div class="map-loading-overlay"></div>' + zoomer + '<svg id="' + _this.options.target_id + '-svg"></svg>'
        );

        var $all = $('#' + _this.options.target_id + ', #' + _this.options.target_id + '-svg');

        if($.browser && !$.browser.mobile) {
            $('#' + _this.options.target_id + '-zoomer').on('click', function (e) {
                e.preventDefault();

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(this).find('.icon-font').removeClass('icon-font-zoom_out').addClass('icon-font-zoom_in');
                    _this.zoomIn();
                } else {
                    $(this).addClass('active');
                    $(this).find('.icon-font').removeClass('icon-font-zoom_in').addClass('icon-font-zoom_out');
                    _this.zoomOut();
                }
            });
        }

        if(_this.options.viewport_width && _this.options.viewport_height){
            $all.css({
                width: _this.options.viewport_width,
                height: 100
            });
        }

        this.wrapper = true;
    };

    function draw(onLoad) {
        _this.initialized = true;

        var $all = $('#' + _this.options.target_id + ', #' + _this.options.target_id + '-svg');

        s = Snap('#' + _this.options.target_id + '-svg');

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

                    if(_this.options.viewport_width && _this.options.viewport_height){
                        setTimeout(function(){
                            $all.animate({
                                width: _this.options.viewport_width,
                                height: _this.options.viewport_height
                            }, 300, function(){

                                setTimeout(function(){
                                    $('.map-loading-overlay').addClass('hidden');

                                    setTimeout(function(){
                                        $('.map-loading-overlay').remove();
                                        if(onLoad) onLoad();
                                    }, 300);
                                }, 300);
                            });
                        }, 700);
                    }
                });
            });
        });
    }

    function zoomInit (done){
        if(done) done();

        s.zoomTo(_this.options.min_zoom, 0, mina.easeinout, function(){

        }, {
            vp_w: _this.options.viewport_width,
            vp_h: _this.options.viewport_height,
            c_w: _this.options.map_width,
            c_h: _this.options.map_height,
            offset_x: _this.options.offset_x,
            offset_y: _this.options.offset_y
        });
    }

    function drawStation(data){
        var station = new iMap.Station(s, data, {
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
        }, _this);

        if(data.type == 'end'){
            if(data.line_selector){
                station.line_end = new iMap.LineButton(s, _this, data.line_selector);
            }
        }else{
            station.line_end = null;
        }

        stations.push(station);
    }

    function drawSelector(data){
        var selector = new iMap.LineButton(s, _this, data);

        selectors.push(selector);
    }

    function loadStations(done){
        $.ajax({
            url: _this.options.data_url,
            type: 'get',
            dataType: 'json',
            success: function(data){
                for (var i = 0; i < data.stations.length; i++) {
                    drawStation(data.stations[i]);
                }

                for (var i = 0; i < data.selectors.length; i++) {
                    drawSelector(data.selectors[i]);
                }

                if(done) done();
            }
        });
    }

    // Public methods
    this.zoomOut = function(immediately){
        s.zoomTo(this.options.max_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){

        }, {
            vp_w: _this.options.viewport_width,
            vp_h: _this.options.viewport_height,
            c_w: _this.options.map_width,
            c_h: _this.options.map_height,
            offset_x: _this.options.offset_x,
            offset_y: _this.options.offset_y
        });
    };

    this.zoomIn = function(immediately){
        s.zoomTo(this.options.min_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){

        }, {
            vp_w: _this.options.viewport_width,
            vp_h: _this.options.viewport_height,
            c_w: _this.options.map_width,
            c_h: _this.options.map_height,
            offset_x: _this.options.offset_x,
            offset_y: _this.options.offset_y
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

    this.getSelectedStations = function(){
        var arr = [];

        for (var i = 0; i < stations.length; i++) {
            if(stations[i].isSelected() === true){
                arr.push(stations[i]);
            }
        }

        return arr;
    };

    this.selectStationById = function(id){
        var station = this.getStationById(id);

        if(station){
            station.select();
        }
    };

    this.unselectStationById = function(id){
        var station = this.getStationById(id);

        if(station){
            station.unselect();
        }
    };

    this.init = function(onLoad) {
        draw(onLoad);
    };

    this.getSnapInstance = function(){
        return s;
    };
};

iMap.Station = function(s, data, options, map_superclass){
    var _this = this,
        selected = false,
        $node = $('#um-station-' + data.id),
        $chld = $node.children(),
        selected_g = $chld[3],
        unselected_g = $chld[0],
        text = $chld[2];

    this.select = function(){
        selected = true;
        $(selected_g).css({opacity: 1});
        $(unselected_g).css({opacity: 0});
        $(text).attr('fill', iMap.config.text_selected_color);
    };

    this.unselect = function(){
        selected = false;
        $(selected_g).css({opacity: 0});
        $(unselected_g).css({opacity: 1});
        $(text).attr('fill', iMap.config.text_idle_fill_color);
    };

    this.isSelected = function(){
        return selected;
    };

    this.getData = function(){
        return data;
    };

    this.getDataParam = function(param){
        return data[param];
    };

    this.trigger = function(){
        if(selected){
            this.unselect();
        }else{
            this.select();
        }
    };

    $node.on('click', function(e){
        e.preventDefault();
        _this.trigger();
    });
};

iMap.LineButton = function(s, map, data){

};