var iMap={};iMap.config={text_idle_fill_color:"rgba(0, 0, 0, 1)",shape_idle_fill_color:"rgba(255, 255, 255, 1)",selected_color:"rgba(240, 0, 0, 1)",hover_color:"rgba(200, 0, 0, 1)",hover_selected_color:"rgba(220, 0, 0, 1)",bar_width:7,bar_height:7,bar_width_selected:7,bar_height_selected:7,end_width:21,end_height:7,end_width_selected:21,end_height_selected:7,circle_radius:7,circle_stroke_width:5,circle_stroke_width_selected:5},iMap.Map=function(t){function i(t){a.initialized=!0,s=Snap("#"+a.options.target_id+"-svg"),Snap.load(a.options.map_svg,function(i){s.append(i),e(function(){s.zpd({zoom:!1,pan:!0,drag:!1}),o(function(){a.options.onLoad(),$(".map-loading-overlay").addClass("hidden"),setTimeout(function(){$(".map-loading-overlay").remove()},300),t&&t()})})})}function o(t){t&&t(),s.zoomTo(a.options.min_zoom,0,mina.easeinout,function(){},{vp_w:a.options.viewport_width,vp_h:a.options.viewport_height,c_w:a.options.map_width,c_h:a.options.map_height,offset_x:a.options.offset_x,offset_y:a.options.offset_y})}function n(t,i){c.push(new iMap.Station(s,t,{on_click_enabled:a.options.station_on_click_enabled,onMouseOver:function(t){a.options.onStationMouseOver(t,s)},onMouseOut:function(t){a.options.onStationMouseOut(t,s)},onSelect:function(t,i){a.options.onStationSelect(t,s,i)},onUnselect:function(t,i){a.options.onStationUnselect(t,s,i)},onClick:function(t){a.options.onStationClick(t,s)},onDblClick:function(t){a.options.onStationDblClick(t,s)}},a))}function e(t){$.ajax({url:a.options.data_url,type:"get",dataType:"json",success:function(i){for(var o=0;o<i.length;o++)n(i[o],o);t&&t()}})}var a=this,c=[];this.options=$.extend({target_id:"",map_svg:"",data_url:"",min_zoom:.75,viewport_width:!1,viewport_height:!1,map_width:!1,map_height:!1,offset_x:!1,offset_y:!1,max_zoom:1,zoom_animation_time:300,station_on_click_enabled:!0,onLoad:function(){},onStationClick:function(t,i){},onStationMouseOver:function(t,i){},onStationMouseOut:function(t,i){},onStationSelect:function(t,i,o){},onStationUnselect:function(t,i,o){},onStationDblClick:function(t,i){}},t),this.initialized=!1,this.wrapper=!1;var r=$("#"+this.options.target_id),s=null;this.drawWraps=function(){var t='<div class="map-transport-times">До станции <a class="type-selector link-dotted" href="#"><span class="dotted">пешком</span></a><span class="time"><i class="icon-font unactive icon-font-arr-left"></i><span>10 мин</span><i class="icon-font icon-font-arr-right"></i></span></div>',i=["пешком","на машине"],o=[10,15,20],n=0;r.html('<div class="map-loading-overlay"></div>'+t+'<a href="#" class="zoomer" id="'+a.options.target_id+'-zoomer"><i class="icon-font icon-font-zoom_in"></i></a><svg id="'+a.options.target_id+'-svg"></svg>');var e=$("#"+a.options.target_id+", #"+a.options.target_id+"-svg");$("#"+a.options.target_id+"-zoomer").on("click",function(t){t.preventDefault(),$(this).hasClass("active")?($(this).removeClass("active"),$(this).find(".icon-font").removeClass("icon-font-zoom_out").addClass("icon-font-zoom_in"),a.zoomIn()):($(this).addClass("active"),$(this).find(".icon-font").removeClass("icon-font-zoom_in").addClass("icon-font-zoom_out"),a.zoomOut())}),a.options.viewport_width&&a.options.viewport_height&&e.css({width:a.options.viewport_width,height:a.options.viewport_height});var c=$(".map-transport-times");c.find(".type-selector").on("click",function(t){t.preventDefault();var o=$(this).find("span").text(),n=$.inArray(o,i),e=0;n>-1&&(e=n+1,e>i.length-1&&(e=0)),$(this).find("span").text(i[e])}),c.find(".icon-font").on("click",function(t){t.preventDefault(),$(this).hasClass("icon-font-arr-left")?0>n-1?n=0:n--:n+1>o.length-1?n=o.length-1:n++,n==o.length-1?$(".icon-font-arr-right").addClass("unactive"):$(".icon-font-arr-right").removeClass("unactive"),0==n?$(".icon-font-arr-left").addClass("unactive"):$(".icon-font-arr-left").removeClass("unactive"),c.find(".time > span").text(o[n]+" мин")}),this.wrapper=!0},this.zoomOut=function(t){s.zoomTo(this.options.max_zoom,t?0:this.options.zoom_animation_time,mina.easeinout,function(){},{vp_w:a.options.viewport_width,vp_h:a.options.viewport_height,c_w:a.options.map_width,c_h:a.options.map_height,offset_x:a.options.offset_x,offset_y:a.options.offset_y})},this.zoomIn=function(t){s.zoomTo(this.options.min_zoom,t?0:this.options.zoom_animation_time,mina.easeinout,function(){},{vp_w:a.options.viewport_width,vp_h:a.options.viewport_height,c_w:a.options.map_width,c_h:a.options.map_height,offset_x:a.options.offset_x,offset_y:a.options.offset_y})},this.getStations=function(){return c},this.getStationById=function(t){for(var i=0;i<c.length;i++){var o=c[i];if(o.getData().id==t)return o}},this.unselectAllStations=function(){for(var t=0;t<c.length;t++)c[t].unselect()},this.iterateAllStations=function(t){for(var i=0;i<c.length;i++)t&&t(c[i])},this.getSelectedStations=function(){for(var t=[],i=0;i<c.length;i++)c[i].getDataParam("selected")===!0&&t.push(c[i]);return t},this.selectStationById=function(t){var i=this.getStationById(t);i&&i.select()},this.unselectStationById=function(t){var i=this.getStationById(t);i&&i.unselect()},this.init=function(t){i(t)},this.getSnapInstance=function(){return s}},iMap.Shape=function(t,i){function o(){var o=t.circle(i.x,i.y,iMap.config.circle_radius);return o.attr({fill:iMap.config.shape_idle_fill_color,stroke:i.color,strokeWidth:iMap.config.circle_stroke_width,cursor:"pointer"}),o}function n(){var o=t.rect(i.x,i.y,iMap.config.bar_width,iMap.config.bar_height);return o.attr({fill:i.color,cursor:"pointer"}),o}function e(){var o=t.rect(i.x,i.y,iMap.config.end_width,iMap.config.end_height);return o.attr({fill:i.color,cursor:"pointer"}),o}function a(){switch(i.type){case"circle":r=o();break;case"bar":r=n();break;case"end":r=e()}}var c=this,r=null;this.rotate=function(t,i,o){var n=r.getBBox(),e=n.cx,a=n.cy;if(i===!0)r.animate({transform:"r"+t+","+e+","+a},200,function(){o&&o()});else{var c=(new Snap.Matrix).rotate(t,e,a);r.transform(c)}},this.getShape=function(){return r},a(),c.rotate(i.rotate)},iMap.Station=function(t,i,o,n){function e(t,i){t&&t.attr(i)}function a(t,i){t=String(t).replace(/[^0-9a-f]/gi,""),t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),i=i||0;var o="#",n,e;for(e=0;3>e;e++)n=parseInt(t.substr(2*e,2),16),n=Math.round(Math.min(Math.max(0,n+n*i),255)).toString(16),o+=("00"+n).substr(n.length);return o}function c(){switch(i.type){case"bar":return{fill:a(i.color,-.25),width:iMap.config.bar_width,height:iMap.config.bar_height};break;case"end":return{fill:a(i.color,-.25),width:iMap.config.end_width,height:iMap.config.end_height};break;case"circle":return{stroke:a(i.color,-.25)}}}function r(){switch(i.type){case"bar":return{fill:iMap.config.selected_color,width:iMap.config.bar_width_selected,height:iMap.config.bar_height_selected};break;case"end":return{fill:iMap.config.selected_color,width:iMap.config.end_width_selected,height:iMap.config.end_height_selected};break;case"circle":return{stroke:iMap.config.selected_color,fill:iMap.config.selected_color,strokeWidth:iMap.config.circle_stroke_width_selected}}}function s(){switch(i.type){case"bar":return{fill:iMap.config.hover_selected_color,width:iMap.config.bar_width_selected,height:iMap.config.bar_height_selected};break;case"end":return{fill:iMap.config.hover_selected_color,width:iMap.config.end_width_selected,height:iMap.config.end_height_selected};break;case"circle":return{stroke:iMap.config.hover_selected_color,fill:iMap.config.hover_selected_color,strokeWidth:iMap.config.circle_stroke_width_selected}}}function l(){switch(i.type){case"bar":return{fill:i.color,width:iMap.config.bar_width,height:iMap.config.bar_height};break;case"end":return{fill:i.color,width:iMap.config.end_width,height:iMap.config.end_height};break;case"circle":return{stroke:i.color,fill:iMap.config.shape_idle_fill_color,strokeWidth:iMap.config.circle_stroke_width}}}function f(t,i,o){g=!0,t.attr(r()),e(i,{fill:iMap.config.selected_color}),_.selectBinded(),_.options.onSelect(_,o)}function h(t,i,o){g=!1,t.attr(l()),e(i,{fill:iMap.config.text_idle_fill_color}),_.unselectBinded(),_.options.onUnselect(_,!1)}function p(t,i){g?(t.attr(s()),i.attr({fill:iMap.config.hover_selected_color})):(t.attr(c()),e(i,{fill:iMap.config.hover_color})),_.options.onMouseOver(_)}function d(t,i){g?(t.attr(r()),i.attr({fill:iMap.config.selected_color})):(t.attr(l()),e(i,{fill:iMap.config.text_idle_fill_color})),_.options.onMouseOut(_)}function u(){M=v.getShape(),k=m.getBg(),b=m.getText(),w=t.g(M,k,b),w.hover(function(){p(M,b)},function(){d(M,b)}),_.options.on_click_enabled===!0&&w.click(function(){g?h(M,b):f(M,b),_.options.onClick(_)}),w.dblclick(function(){_.options.onDblClick(_)})}var _=this,g=!1;i.x=parseFloat(i.x),i.y=parseFloat(i.y),i.rotate=parseInt(i.rotate),i.margin=parseInt(i.margin);var v=new iMap.Shape(t,i),m=new iMap.Text(t,i,v.getShape()),w=null,M=null,b=null,k=null;this.options=$.extend({on_click_enabled:!0,onClick:function(t){},onSelect:function(t,i){},onUnselect:function(t,i){},onMouseOver:function(t){},onMouseOut:function(t){},onDblClick:function(t){}},o),this.selectBinded=function(){if(i.bind)for(var t=0;t<i.bind.length;t++){var o=i.bind[t],e=n.getStationById(o);e&&!e.isSelected()&&e.select(!0)}},this.unselectBinded=function(){if(i.bind)for(var t=0;t<i.bind.length;t++){var o=i.bind[t],e=n.getStationById(o);e&&e.isSelected()&&e.unselect(!0)}},this.select=function(t){g||f(M,b,t)},this.unselect=function(t){g&&h(M,b,t)},this.isSelected=function(){return g},this.getData=function(){return i},this.getGroup=function(){return w},this.setDataParam=function(t,o){i[t]=o},this.getDataParam=function(t){return i[t]},this.renewData=function(){m.changeText(i),M.attr(this.isSelected()?r():l()),v.rotate(i.rotate,!0,function(){m.changeText(i)})},u(),i.selected&&this.select()},iMap.Text=function(t,i,o){function n(){var t=0,n=0,e=s.getBBox(),a=o.getBBox(),c=3;switch(i.text_side){case"top":t=a.cx-e.width/2,n=a.y-i.margin;break;case"right":t=a.x2+i.margin,n=a.cy+e.height/2-c;break;case"bottom":t=a.cx-e.width/2,n=a.y2+e.height+i.margin-c;break;case"left":t=a.x-e.width-i.margin-c,n=a.cy+e.height/2-c}return{x:t,y:n}}function e(){l=t.rect(0,0,0,0),l.attr({fill:"rgba(255, 255, 255, 0.75)",cursor:"pointer"})}function a(){var t=s.getBBox(),i=t.x-f,o=t.y-h,n=t.width+2*f,e=t.height+2*h;l.attr({x:i,y:o,width:n,height:e})}function c(){e(),s=Snap("svg").multitext(0,0,i.name),s.attr({fontSize:15,cursor:"pointer"}),r.changeText(i)}var r=this,s=null,l=null,f=2,h=0;this.getText=function(){return s},this.getBg=function(){return l},this.changeText=function(t){var i=n();s.transform("t"+i.x+","+i.y),a()},c()};