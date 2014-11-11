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

var SText = function(s, data, shape){
    this.empty = false;

    if(!data.name){
        this.empty = true;
        return;
    }

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
                x = shape_bb.cx - text_bb.width / 2 + offset;
                y = shape_bb.y - offset - data.margin;
            } break;

            case 'right' : {
                x = shape_bb.x2 + offset + data.margin;
                y = shape_bb.cy + text_bb.height / 4;
            } break;

            case 'bottom' : {
                x = shape_bb.cx - text_bb.width / 2 + offset;
                y = shape_bb.y2 + text_bb.height - offset + data.margin;
            } break;

            case 'left' : {
                x = shape_bb.x - text_bb.width + offset * 3 - data.margin;
                y = shape_bb.cy + text_bb.height / 4;
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
        createBg(); // todo: СДЕЛАТЬ ОПЦИЮ, ЧТОБЫ ГРУЗИТЬ/НЕ ГРУЗИТЬ ФОН ПРОЗРАЧНЫЙ

        text = s.text(0, 0, data.name);

        var coords = getSnapCoords();

        text.attr({
            x: coords.x,
            y: coords.y,
            fontSize: 14,
            cursor: 'pointer'
        });

        snapBg();
    }

    this.getText = function(){
        return text;
    };

    this.getBg = function(){
        return bg;
    };

    createTextAndBg();
};

var SShape = function(s, data){
    var shape = null;

    function createCircle(){
        var shape = s.circle(data.x, data.y, config.circle_radius);

        shape.attr({
            fill: config.shape_idle_fill_color,
            stroke: data.color,
            strokeWidth: config.circle_stroke_width,
            cursor: 'pointer'
        });

        return shape;
    }

    function createBar(){
        var shape = s.rect(data.x, data.y, config.bar_width, config.bar_height);

        shape.attr({
            fill: data.color,
            cursor: 'pointer'
        });

        var t = new Snap.Matrix().rotate(data.rotate, data.x + 2, data.y + 2);

        shape.transform(t);

        return shape;
    }

    function createEnd(){
        var shape = s.rect(data.x, data.y, config.end_width, config.end_height);

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

    create();

    this.getShape = function(){
        return shape;
    };
};

var SStation = function(s, data, options, map_superclass){
    var _this = this,
        selected = false;

    // Normalize data
    data.x = parseFloat(data.x);
    data.y = parseFloat(data.y);
    data.width = parseInt(data.width);
    data.stroke_width = parseInt(data.stroke_width);
    data.rotate = parseInt(data.rotate);
    data.margin = parseInt(data.margin);

    var _shape = new SShape(s, data),
        _text = new SText(s, data, _shape.getShape()),
        group = null,
        shape = null,
        text = null,
        text_bg = null;

    this.options = $.extend({
        onClick: function(station_instance){

        },
        onSelect: function(station_instance){

        },
        onUnselect: function(station_instance){

        },
        onMouseOver: function(station_instance){

        },
        onMouseOut: function(station_instance){

        }
    }, options);

    function setTextAttrs(text, attrs){
        text.attr(attrs);
    }

    function getHoverStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: config.selected_color,
                    width: config.bar_width,
                    height: config.bar_height
                }
            } break;

            case 'end': {
                return {
                    fill: config.hover_color,
                    width: config.end_width,
                    height: config.end_height
                }
            } break;

            case 'circle': {
                return {
                    stroke: config.hover_color
                }
            } break;
        }
    }

    function getSelectedStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: config.selected_color,
                    width: config.bar_width_selected,
                    height: config.bar_height_selected
                }
            } break;

            case 'end': {
                return {
                    fill: config.selected_color,
                    width: config.end_width_selected,
                    height: config.end_height_selected
                }
            } break;

            case 'circle': {
                return {
                    stroke: config.selected_color,
                    fill: config.selected_color,
                    strokeWidth: config.circle_stroke_width_selected
                }
            } break;
        }
    }

    function getSelectedHoverStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: config.hover_selected_color,
                    width: config.bar_width_selected,
                    height: config.bar_height_selected
                }
            } break;

            case 'end': {
                return {
                    fill: config.hover_selected_color,
                    width: config.end_width_selected,
                    height: config.end_height_selected
                }
            } break;

            case 'circle': {
                return {
                    stroke: config.hover_selected_color,
                    fill: config.hover_selected_color,
                    strokeWidth: config.circle_stroke_width_selected
                }
            } break;
        }
    }

    function getNormalStyle(){
        switch(data.type){
            case 'bar': {
                return {
                    fill: data.color,
                    width: config.bar_width,
                    height: config.bar_height
                }
            } break;

            case 'end': {
                return {
                    fill: data.color,
                    width: config.end_width,
                    height: config.end_height
                }
            } break;

            case 'circle': {
                return {
                    stroke: data.color,
                    fill: config.shape_idle_fill_color,
                    strokeWidth: config.circle_stroke_width
                }
            } break;
        }
    }

    function select(shape, text){
        selected = true;

        shape.attr(getSelectedStyle());

        setTextAttrs(text, {
            fill: config.selected_color
        });

        _this.selectBinded();
        _this.options.onSelect(_this);
    }

    function unselect(shape, text){
        selected = false;

        shape.attr(getNormalStyle());

        setTextAttrs(text, {
            fill: config.text_idle_fill_color
        });

        _this.unselectBinded();
        _this.options.onUnselect(_this);
    }

    function mouseOver(shape, text){
        if(selected){
            shape.attr(getSelectedHoverStyle());

            text.attr({
                fill: config.hover_selected_color
            });
        }else{
            shape.attr(getHoverStyle());

            setTextAttrs(text, {
                fill: config.hover_color
            });
        }

        _this.options.onMouseOver(_this);
    }

    function mouseOut(shape, text){
        if(selected){
            shape.attr(getSelectedStyle());

            text.attr({
                fill: config.selected_color
            });
        }else{
            shape.attr(getNormalStyle());

            setTextAttrs(text, {
                fill: config.text_idle_fill_color
            });
        }

        _this.options.onMouseOut(_this);
    }

    function createGroup(){
        shape = _shape.getShape();

        if(!_text.empty) {
            text_bg = _text.getBg();
            text = _text.getText();
            group = s.g(shape, text_bg, text);
        }else{
            group = s.g(shape);
        }

        group.hover(function(){
            mouseOver(shape, text);
        }, function(){
            mouseOut(shape, text);
        });

        group.click(function(){
            if(selected){
                unselect(shape, text);
            }else{
                select(shape, text);
            }

            _this.options.onClick(_this);
        });
    }

    this.selectBinded = function(){
        if(data.bind) {
            for (var i = 0; i < data.bind.length; i++) {
                var obj = data.bind[i],
                    bs = map_superclass.getStationById(obj);

                if(bs && !bs.isSelected()){
                    bs.select();
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
                    bs.unselect();
                }
            }
        }
    };

    this.select = function(){
        if(!selected){
            select(shape, text);
        }
    };

    this.unselect = function(){
        if(selected){
            unselect(shape, text);
        }
    };

    this.isSelected = function(){
        return selected;
    };

    this.getData = function(){
        return data;
    };

    createGroup();
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
