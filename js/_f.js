$(function() {

    var canvas = new fabric.Canvas('canvas');
    var group = [];

    fabric.loadSVGFromURL("/img/moscow_1.svg", function(objects, options) {
        var loadedObjects = new fabric.Group(group);

        loadedObjects.set({
            left: 100,
            top: 100,
            width: 175,
            height: 175
        });

        canvas.add(loadedObjects);
        canvas.renderAll();

    }, function(item, object) {
        object.set('id', item.getAttribute('id'));
        group.push(object);
    });
});