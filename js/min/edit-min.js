var m;$(function(){$(".container, .map").css({width:can_w,height:can_h}),m=new iMap.Map({target_id:"map",map_svg:mapSvg,data_url:dataJson,min_zoom:.68,viewport_width:can_w,viewport_height:can_h,map_width:map_w,map_height:map_h,offset_x:offset_x,offset_y:offset_y,station_on_click_enabled:!1,onStationDblClick:function(t,n){m.iterateAllStations(function(e){e.getData().id!=t.getData().id&&e.disableEdit(n)}),t.isSelected()?t.disableEdit(n):t.enableEdit(n)},onStationSelect:function(t,n){},onStationUnselect:function(t,n){}}),m.init(),$(".zoomer").on("click",function(t){t.preventDefault(),$(this).hasClass("active")?($(this).removeClass("active"),m.zoomIn()):($(this).addClass("active"),m.zoomOut())}),$(".seditor-add").on("click",function(t){t.preventDefault();var n={color:"#ff0000",x:50,y:50,type:$(this).data("type"),rotate:0,text_side:"right",name:"New station",margin:5,id:m.generateId(),"new":!0,changed:!0},e=new iMap.Station(m.getSnapInstance(),n,{on_click_enabled:m.options.station_on_click_enabled,onMouseOver:function(t){m.options.onStationMouseOver(t,m.getSnapInstance())},onMouseOut:function(t){m.options.onStationMouseOut(t,m.getSnapInstance())},onSelect:function(t){m.options.onStationSelect(t,m.getSnapInstance())},onUnselect:function(t){m.options.onStationUnselect(t,m.getSnapInstance())},onClick:function(t){m.options.onStationClick(t,m.getSnapInstance())},onDblClick:function(t){m.options.onStationDblClick(t,m.getSnapInstance())}},m);e.setDataParam("changed",!0),e.setDataParam("x",e.getGroup().getBBox().x2),e.setDataParam("y",e.getGroup().getBBox().y2),m.getStations().push(e)}),$("#seditor-upload").on("click",function(t){t.preventDefault(),confirm("are you sure to upload?")&&$.ajax({url:"json.php",type:"post",data:{json:JSON.stringify(m.getStationsData())},beforeSend:function(){$("body").append('<div class="loading"><div>Loading...</div></div>')},success:function(){$(".loading").remove()}})})});