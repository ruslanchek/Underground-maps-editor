var iMap = {};

iMap.config = {
    text_idle_fill_color  : 'rgba(0, 0, 0, 1)',

    shape_idle_fill_color : 'rgba(255, 255, 255, 1)',
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

iMap.Map = function(options) {
    var _this = this,
        stations = [];

    this.options = $.extend({
        target_id: '',
        map_svg: '',
        data_url: '',
        min_zoom: 0.75,
        viewport_width: false,
        viewport_height: false,
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
        var time_selector = '<div class="map-transport-times">До станции <a class="type-selector link-dotted" href="#"><span class="dotted">пешком</span></a><span class="time"><i class="icon-font unactive icon-font-arr-left"></i><span>10 мин</span><i class="icon-font icon-font-arr-right"></i></span></div>';

        var transport_types = ['пешком', 'на машине'];
        var transport_times = [10, 15, 20];
        var current_time = 0;

        $container.html(
            '<div class="map-loading-overlay"></div>' + time_selector + '<a href="#" class="zoomer" id="' + _this.options.target_id + '-zoomer"><i class="icon-font icon-font-zoom_in"></i></a><svg id="' + _this.options.target_id + '-svg"></svg>'
        );

        var $all = $('#' + _this.options.target_id + ', #' + _this.options.target_id + '-svg');

        $('#' + _this.options.target_id + '-zoomer').on('click', function(e){
            e.preventDefault();

            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $(this).find('.icon-font').removeClass('icon-font-zoom_out').addClass('icon-font-zoom_in');
                _this.zoomIn();
            }else{
                $(this).addClass('active');
                $(this).find('.icon-font').removeClass('icon-font-zoom_in').addClass('icon-font-zoom_out');
                _this.zoomOut();
            }
        });

        if(_this.options.viewport_width && _this.options.viewport_height){
            $all.css({
                width: _this.options.viewport_width,
                height: _this.options.viewport_height
            });
        }

        var $tt = $('.map-transport-times');

        $tt.find('.type-selector').on('click', function(e){
            e.preventDefault();

            var curr = $(this).find('span').text(),
                in_a = $.inArray(curr, transport_types),
                next = 0;

            if(in_a > -1){
                next = in_a + 1;

                if(next > transport_types.length - 1){
                    next = 0;
                }
            }

            $(this).find('span').text(transport_types[next]);
        });

        $tt.find('.icon-font').on('click', function(e){
            e.preventDefault();

            if($(this).hasClass('icon-font-arr-left')){
                if(current_time - 1 < 0){
                    current_time = 0;
                }else{
                    current_time--;
                }
            }else{
                if(current_time + 1 > transport_times.length - 1){
                    current_time = transport_times.length - 1;
                }else{
                    current_time++;
                }
            }

            if(current_time == transport_times.length - 1){
                $('.icon-font-arr-right').addClass('unactive');
            }else{
                $('.icon-font-arr-right').removeClass('unactive');
            }

            if(current_time == 0){
                $('.icon-font-arr-left').addClass('unactive');
            }else{
                $('.icon-font-arr-left').removeClass('unactive');
            }

            $tt.find('.time > span').text(transport_times[current_time] + ' мин');
        });

        this.wrapper = true;
    };

    function draw(onLoad) {
        _this.initialized = true;

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
                    $('.map-loading-overlay').addClass('hidden');

                    setTimeout(function(){
                        $('.map-loading-overlay').remove();
                    }, 300);

                    if(onLoad) onLoad();
                });
            });
        });
    }

    function zoomInit (done){
        if(done) done();

        s.zoomTo(_this.options.min_zoom, 0, mina.easeinout, function(){

        });
    }

    function drawStation(data, i){
        stations.push(new iMap.Station(s, data, {
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
                    drawStation(data[i], i);
                }

                if(done) done();
            }
        });
    }

    // Public methods
    this.zoomOut = function(immediately){
        s.zoomTo(this.options.max_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){

        });
    };

    this.zoomIn = function(immediately){
        s.zoomTo(this.options.min_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout, function(){

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
            if(stations[i].getDataParam('selected') === true){
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

iMap.Shape = function(s, data){
    var _this = this,
        shape = null;

    function createCircle(){
        var shape = s.circle(data.x, data.y, iMap.config.circle_radius);

        shape.attr({
            fill: iMap.config.shape_idle_fill_color,
            stroke: data.color,
            strokeWidth: iMap.config.circle_stroke_width,
            cursor: 'pointer'
        });

        return shape;
    }

    function createBar(){
        var shape = s.rect(data.x, data.y, iMap.config.bar_width, iMap.config.bar_height);

        shape.attr({
            fill: data.color,
            cursor: 'pointer'
        });

        return shape;
    }

    function createEnd(){
        var shape = s.rect(data.x, data.y, iMap.config.end_width, iMap.config.end_height);

        shape.attr({
            fill: data.color,
            cursor: 'pointer'
        });

        return shape;
    }

    function create(){
        switch(data.type){
            case 'circle' : {
                shape = createCircle();
            } break;

            case 'bar' : {
                shape = createBar();
            } break;

            case 'end' : {
                shape = createEnd();
            } break;
        }
    }

    // Public methods
    this.rotate = function(deg, animate, done){
        var s_bb = shape.getBBox(),
            x = s_bb.cx,
            y = s_bb.cy;

        if (animate === true) {
            shape.animate({
                transform: 'r' + deg + ',' + x + ',' + y
            }, 200, function () {
                if (done) done();
            });
        } else {
            var t = new Snap.Matrix().rotate(deg, x, y);

            shape.transform(t);
        }
    };

    this.getShape = function(){
        return shape;
    };

    create();

    _this.rotate(data.rotate);
};

iMap.Station = function(s, data, options, map_superclass){
    var _this = this,
        selected = false;

    // Normalize data
    data.x = parseFloat(data.x);
    data.y = parseFloat(data.y);
    data.rotate = parseInt(data.rotate);
    data.margin = parseInt(data.margin);

    var _shape = new iMap.Shape(s, data),
        _text = new iMap.Text(s, data, _shape.getShape()),
        group = null,
        shape = null,
        text = null,
        text_bg = null;

    this.options = $.extend({
        on_click_enabled: true,

        onClick: function(station_instance){

        },

        onSelect: function(station_instance, from_bind){

        },

        onUnselect: function(station_instance, from_bind){

        },

        onMouseOver: function(station_instance){

        },

        onMouseOut: function(station_instance){

        },

        onDblClick: function(station_instance){

        }
    }, options);

    function setTextAttrs(text, attrs){
        if(text) {
            text.attr(attrs);
        }
    }

    function colorLuminance(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');

        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }

        lum = lum || 0;

        var rgb = "#", c, i;

        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }

    function getHoverStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: colorLuminance(data.color, -0.25),
                    width: iMap.config.bar_width,
                    height: iMap.config.bar_height
                }
            } break;

            case 'end': {
                return {
                    fill: colorLuminance(data.color, -0.25),
                    width: iMap.config.end_width,
                    height: iMap.config.end_height
                }
            } break;

            case 'circle': {
                return {
                    stroke:colorLuminance(data.color, -0.25)
                }
            } break;
        }
    }

    function getSelectedStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: iMap.config.selected_color,
                    width: iMap.config.bar_width_selected,
                    height: iMap.config.bar_height_selected
                }
            } break;

            case 'end': {
                return {
                    fill: iMap.config.selected_color,
                    width: iMap.config.end_width_selected,
                    height: iMap.config.end_height_selected
                }
            } break;

            case 'circle': {
                return {
                    stroke: iMap.config.selected_color,
                    fill: iMap.config.selected_color,
                    strokeWidth: iMap.config.circle_stroke_width_selected
                }
            } break;
        }
    }

    function getSelectedHoverStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: iMap.config.hover_selected_color,
                    width: iMap.config.bar_width_selected,
                    height: iMap.config.bar_height_selected
                }
            } break;

            case 'end': {
                return {
                    fill: iMap.config.hover_selected_color,
                    width: iMap.config.end_width_selected,
                    height: iMap.config.end_height_selected
                }
            } break;

            case 'circle': {
                return {
                    stroke: iMap.config.hover_selected_color,
                    fill: iMap.config.hover_selected_color,
                    strokeWidth: iMap.config.circle_stroke_width_selected
                }
            } break;
        }
    }

    function getNormalStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: data.color,
                    width: iMap.config.bar_width,
                    height: iMap.config.bar_height
                }
            } break;

            case 'end': {
                return {
                    fill: data.color,
                    width: iMap.config.end_width,
                    height: iMap.config.end_height
                }
            } break;

            case 'circle': {
                return {
                    stroke: data.color,
                    fill: iMap.config.shape_idle_fill_color,
                    strokeWidth: iMap.config.circle_stroke_width
                }
            } break;
        }
    }

    function select(shape, text, from_bind){
        selected = true;

        shape.attr(getSelectedStyle());

        setTextAttrs(text, {
            fill: iMap.config.selected_color
        });

        _this.selectBinded();
        _this.options.onSelect(_this, from_bind);
    }

    function unselect(shape, text, from_bind){
        selected = false;

        shape.attr(getNormalStyle());

        setTextAttrs(text, {
            fill: iMap.config.text_idle_fill_color
        });

        _this.unselectBinded();
        _this.options.onUnselect(_this, false);
    }

    function mouseOver(shape, text){
        if(selected){
            shape.attr(getSelectedHoverStyle());

            text.attr({
                fill: iMap.config.hover_selected_color
            });
        }else{
            shape.attr(getHoverStyle());

            setTextAttrs(text, {
                fill: iMap.config.hover_color
            });
        }

        _this.options.onMouseOver(_this);
    }

    function mouseOut(shape, text){
        if(selected){
            shape.attr(getSelectedStyle());

            text.attr({
                fill: iMap.config.selected_color
            });
        }else{
            shape.attr(getNormalStyle());

            setTextAttrs(text, {
                fill: iMap.config.text_idle_fill_color
            });
        }

        _this.options.onMouseOut(_this);
    }

    function createGroup(){
        shape = _shape.getShape();

        text_bg = _text.getBg();
        text = _text.getText();
        group = s.g(shape, text_bg, text);

        group.hover(function(){
            mouseOver(shape, text);
        }, function(){
            mouseOut(shape, text);
        });

        if(_this.options.on_click_enabled === true) {
            group.click(function () {
                if (selected) {
                    unselect(shape, text);
                } else {
                    select(shape, text);
                }

                _this.options.onClick(_this);
            });
        }

        group.dblclick(function(){
            _this.options.onDblClick(_this);
        });
    }

    this.selectBinded = function(){
        if(data.bind) {
            for (var i = 0; i < data.bind.length; i++) {
                var obj = data.bind[i],
                    bs = map_superclass.getStationById(obj);

                if(bs && !bs.isSelected()){
                    bs.select(true);
                }
            }
        }
    };

    this.unselectBinded = function(){
        if(data.bind) {
            for (var i = 0; i < data.bind.length; i++) {
                var obj = data.bind[i],
                    bs = map_superclass.getStationById(obj);

                if(bs && bs.isSelected()){
                    bs.unselect(true);
                }
            }
        }
    };

    this.select = function(from_bind){
        if(!selected){
            select(shape, text, from_bind);
        }
    };

    this.unselect = function(from_bind){
        if(selected){
            unselect(shape, text, from_bind);
        }
    };

    this.isSelected = function(){
        return selected;
    };

    this.getData = function(){
        return data;
    };

    this.getGroup = function(){
        return group;
    };

    this.setDataParam = function(param, value){
        data[param] = value;
    };

    this.getDataParam = function(param){
        return data[param];
    };

    this.renewData = function(){
        _text.changeText(data);

        if(this.isSelected()){
            shape.attr(getSelectedStyle());
        }else{
            shape.attr(getNormalStyle());
        }

        _shape.rotate(data.rotate, true, function(){
            _text.changeText(data);
        });
    };

    createGroup();

    if(data.selected){
        this.select();
    }
};

iMap.Text = function(s, data, shape){
    var _this = this,
        text = null,
        bg = null,
        snap_offset_x = 2,
        snap_offset_y = 0;

    function getSnapCoords(){
        var x = 0,
            y = 0,
            text_bb = text.getBBox(),
            shape_bb = shape.getBBox(),
            offset = 3;

        switch(data.text_side){
            case 'top' : {
                x = shape_bb.cx - text_bb.width / 2;
                y = shape_bb.y - data.margin;
            } break;

            case 'right' : {
                x = shape_bb.x2 + data.margin;
                y = shape_bb.cy + text_bb.height / 2 - offset;
            } break;

            case 'bottom' : {
                x = shape_bb.cx - text_bb.width / 2 ;
                y = shape_bb.y2 + text_bb.height + data.margin - offset;
            } break;

            case 'left' : {
                x = shape_bb.x - text_bb.width - data.margin - offset;
                y = shape_bb.cy + text_bb.height / 2 - offset;
            } break;
        }

        return {
            x: x,
            y: y
        }
    }

    function createBg(){
        bg = s.rect(0, 0, 0, 0);

        bg.attr({
            fill: 'rgba(255, 255, 255, 0.75)',
            cursor: 'pointer'
        });
    }

    function snapBg(){
        var bb = text.getBBox(),
            x = bb.x - snap_offset_x,
            y = bb.y - snap_offset_y,
            w = bb.width + snap_offset_x * 2,
            h = bb.height + snap_offset_y * 2;

        bg.attr({
            x: x,
            y: y,
            width: w,
            height: h
        });
    }

    function createTextAndBg(){
        createBg();

        text = Snap("svg").multitext(0, 0, data.name);

        text.attr({
            fontSize: 15,
            cursor: 'pointer'
        });

        _this.changeText(data);
    }

    this.getText = function(){
        return text;
    };

    this.getBg = function(){
        return bg;
    };

    this.changeText = function(data){
        var coords = getSnapCoords();

        text.transform('t' + coords.x + ',' + coords.y);

        snapBg();
    };

    createTextAndBg();
};