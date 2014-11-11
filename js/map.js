var config = {
    shape_idle_fill_color : 'rgba(0, 0, 0, 0)',
    selected_color        : 'rgba(240, 0, 0, 1)',
    hover_color           : 'rgba(200, 0, 0, 1)',
    hover_selected_color  : 'rgba(220, 0, 0, 1)',
    text_idle_fill_color  : 'rgba(0, 0, 0, 1)',

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

var SStation = function(s, data, options){
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
        group = null;

    this.options = $.extend({
        onClick: function(e, data){

        },
        onMouseOver: function(e, data){

        },
        onMouseOut: function(e, data){

        }
    }, options);

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

    function select(e, shape, text){
        if(selected){
            selected = false;

            shape.attr(getNormalStyle());

            text.attr({
                fill: config.text_idle_fill_color
            });
        }else{
            selected = true;

            shape.attr(getSelectedStyle());

            text.attr({
                fill: config.selected_color
            });
        }

        _this.options.onClick(e, data);
    }

    function mouseOver(e, shape, text){
        _this.options.onMouseOver(e, data);

        if(selected){
            shape.attr(getSelectedHoverStyle());

            text.attr({
                fill: config.hover_selected_color
            });
        }else{
            shape.attr(getHoverStyle());

            text.attr({
                fill: config.hover_color
            });
        }
    }

    function mouseOut(e, shape, text){
        _this.options.onMouseOut(e, data);

        if(selected){
            shape.attr(getSelectedStyle());

            text.attr({
                fill: config.selected_color
            });
        }else{
            shape.attr(getNormalStyle());

            text.attr({
                fill: config.text_idle_fill_color
            });
        }
    }

    function createGroup(){
        var shape = _shape.getShape(),
            text = _text.getText(),
            text_bg = _text.getBg();

        group = s.g(text_bg, shape, text);

        group.hover(function(e){
            mouseOver(e, shape, text);
        }, function(e){
            mouseOut(e, shape, text);
        });

        group.click(function(e){
            select(e, shape, text);
        });
    }

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

        }
    }, options);

    var $container = $(this.options.selector),
        c_width = $container.width(),
        c_height = $container.height(),
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

    function drawStation(data){
        stations.push(new SStation(s, data));
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

    function zoomInit (done){
        if(done) done();
    }

    // Public methods
    this.zoomOut = function(immediately){
        s.zoomTo(this.options.max_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout);
    };

    this.zoomIn = function(immediately){
        s.zoomTo(this.options.min_zoom, (immediately) ? 0 : this.options.zoom_animation_time, mina.easeinout);
    };



    this.init = function() {
        draw();
    };
};

$(function(){
    var m = new SMap({
        selector: '#map',
        map_svg: 'img/moscow.svg',
        data_url: 'moscow.json',
        min_zoom: 0.68
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


