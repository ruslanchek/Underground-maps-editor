var m;$(function(){m=new iMap.Map({target_id:"map",map_svg:mapSvg,data_url:dataJson,min_zoom:.68,station_on_click_enabled:!1,onStationDblClick:function(t,n){m.iterateAllStations(function(o){o.getData().id!=t.getData().id&&o.disableEdit(n)}),t.isSelected()?t.disableEdit(n):t.enableEdit(n)},onStationSelect:function(t,n){},onStationUnselect:function(t,n){}}),m.init(),$(".zoomer").on("click",function(t){t.preventDefault(),$(this).hasClass("active")?($(this).removeClass("active"),m.zoomIn()):($(this).addClass("active"),m.zoomOut())}),$(".seditor-add").on("click",function(t){t.preventDefault();var n={color:"#ff0000",x:50,y:50,type:$(this).data("type"),rotate:0,text_side:"right",name:"New station",margin:5,id:m.generateId(),"new":!0,changed:!0},o=new SStation(m.getSnap(),n,{on_click_enabled:m.options.station_on_click_enabled,onMouseOver:function(t){m.options.onStationMouseOver(t,m.getSnap())},onMouseOut:function(t){m.options.onStationMouseOut(t,m.getSnap())},onSelect:function(t){m.options.onStationSelect(t,m.getSnap())},onUnselect:function(t){m.options.onStationUnselect(t,m.getSnap())},onClick:function(t){m.options.onStationClick(t,m.getSnap())},onDblClick:function(t){m.options.onStationDblClick(t,m.getSnap())}},m);o.setDataParam("changed",!0),o.setDataParam("x",o.getGroup().getBBox().x2),o.setDataParam("y",o.getGroup().getBBox().y2),m.getStations().push(o)}),$("#seditor-upload").on("click",function(t){t.preventDefault(),confirm("are you sure to upload?")&&$.ajax({url:"json.php",type:"post",data:{json:JSON.stringify(m.getStationsData())},beforeSend:function(){$("body").append('<div class="loading"><div>Loading...</div></div>')},success:function(){$(".loading").remove()}})})});