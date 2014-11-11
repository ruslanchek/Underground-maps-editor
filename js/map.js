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
        text = s.text(0, 0, data.name);

        var coords = getSnapCoords();

        text.attr({
            x: coords.x,
            y: coords.y,
            fontSize: 14,
            cursor: 'pointer'
        });

        createBg(); // todo: СДЕЛАТЬ ОПЦИЮ, ЧТОБЫ ГРУЗИТЬ/НЕ ГРУЗИТЬ ФОН ПРОЗРАЧНЫЙ
        snapBg();
    }

    createTextAndBg();
};

var SShape = function(s, data){
    this.shape = null;

    function createCircle(){
        var shape = s.circle(data.x, data.y, data.width * 2 - 1);

        shape.attr({
            fill: 'rgba(0,0,0,0)',
            stroke: data.color,
            strokeWidth: data.stroke_width,
            cursor: 'pointer'
        });

        return shape;
    }

    function createBar(){
        var shape = s.rect(data.x, data.y, data.width, 4);

        shape.attr({
            fill: data.color,
            stroke: data.color,
            strokeWidth: 3,
            cursor: 'pointer'
        });

        var t = new Snap.Matrix().rotate(data.rotate, data.x + 2, data.y + 2);

        shape.transform(t);

        return shape;
    }

    function createEnd(){
        var shape = s.circle(data.x, data.y, data.width * 2 - 1);

        shape.attr({
            fill: 'rgba(0,0,0,0)',
            stroke: data.color,
            strokeWidth: data.stroke_width,
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

    this.getObject = function(){
        return shape;
    };
};

var SStation = function(s, data){
    function dataNormalizer(){
        data.x = parseFloat(data.x);
        data.y = parseFloat(data.y);
        data.width = parseInt(data.width);
        data.stroke_width = parseInt(data.stroke_width);
        data.rotate = parseInt(data.rotate);
        data.margin = parseInt(data.margin);
    }

    dataNormalizer();

    var _shape = new SShape(s, data),
        _text = new SText(s, data, _shape.getObject());
};

var SMap = function(options) {
    var _this = this;

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

                _this.zoomInit(function(){
                    onLoad();
                });
            });
        });
    }

    function drawStation(data){
        var station = new SStation(s, data);
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

    this.zoomInit = function(done){
        s.attr({
            opacity: 1
        });
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


