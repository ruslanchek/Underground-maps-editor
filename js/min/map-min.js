var SText=function(t,o,n){function i(){var t=0,i=0,a=c.getBBox(),e=n.getBBox(),r=3;switch(o.text_side){case"top":t=e.cx-a.width/2+r,i=e.y-r-o.margin;break;case"right":t=e.x2+r+o.margin,i=e.cy+a.height/4;break;case"bottom":t=e.cx-a.width/2+r,i=e.y2+r;break;case"left":}return{x:t,y:i}}function a(){h=t.rect(0,0,0,0),h.attr({fill:"rgba(255, 255, 255, 0.75)",cursor:"pointer"})}function e(){var t=c.getBBox(),o=t.x-u,n=t.y-p,i=t.width+2*u,a=t.height+2*p;h.attr({x:o,y:n,width:i,height:a})}function r(){c=t.text(0,0,o.name);var n=i();c.attr({x:n.x,y:n.y,fontSize:14,cursor:"pointer"}),a(),e()}var s=this,c=null,h=null,u=2,p=0;r()},SShape=function(t,o){function n(){var n=t.circle(o.x,o.y,2*o.width-1);return n.attr({fill:"rgba(0,0,0,0)",stroke:o.color,strokeWidth:o.stroke_width,cursor:"pointer"}),n}function i(){var n=t.rect(o.x,o.y,o.width,4);n.attr({fill:o.color,stroke:o.color,strokeWidth:3,cursor:"pointer"});var i=(new Snap.Matrix).rotate(o.rotate,o.x+2,o.y+2);return n.transform(i),n}function a(){var n=t.circle(o.x,o.y,2*o.width-1);return n.attr({fill:"rgba(0,0,0,0)",stroke:o.color,strokeWidth:o.stroke_width,cursor:"pointer"}),n}function e(){switch(o.type){case"circle":shape=n();break;case"bar":shape=i();break;case"end":shape=a()}}this.shape=null,e(),this.getObject=function(){return shape}},SStation=function(t,o){function n(){o.x=parseFloat(o.x),o.y=parseFloat(o.y),o.width=parseInt(o.width),o.stroke_width=parseInt(o.stroke_width),o.rotate=parseInt(o.rotate),o.margin=parseInt(o.margin)}n();var i=new SShape(t,o),a=new SText(t,o,i.getObject())},SMap=function(t){function o(){e.options.onLoad()}function n(){h=Snap(e.options.selector),Snap.load(e.options.map_svg,function(t){h.append(t),a(function(){h.zpd({zoom:!1,pan:!0,drag:!1}),e.zoomInit(function(){o()})})})}function i(t){var o=new SStation(h,t)}function a(t){$.ajax({url:e.options.data_url,type:"get",dataType:"json",success:function(o){for(var n=0;n<o.length;n++)i(o[n]);t&&t()}})}var e=this;this.options=$.extend({selector:"",map_svg:"",data_url:"",min_zoom:.75,max_zoom:1,zoom_animation_time:500,onLoad:function(){}},t);var r=$(this.options.selector),s=r.width(),c=r.height(),h=null;this.zoomOut=function(t){h.zoomTo(this.options.max_zoom,t?0:this.options.zoom_animation_time,mina.easeinout)},this.zoomIn=function(t){h.zoomTo(this.options.min_zoom,t?0:this.options.zoom_animation_time,mina.easeinout)},this.zoomInit=function(t){h.attr({opacity:1})},this.init=function(){n()}};$(function(){var t=new SMap({selector:"#map",map_svg:"img/moscow.svg",data_url:"moscow.json",min_zoom:.68});t.init(),$(".zoomer").on("click",function(o){o.preventDefault(),$(this).hasClass("active")?($(this).removeClass("active"),t.zoomIn()):($(this).addClass("active"),t.zoomOut())})});