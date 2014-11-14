(function (Snap) {
	Snap.plugin(function (Snap, Element, Paper, glob) {
		Paper.prototype.multitext = function (x, y, txt) {
			txt = txt.split("\n");
			var o = 0;

			if(txt.length > 1){
				for (var i = 0; i < txt.length; i++) {
					o += 9 * i;
				}
			}

			var t = this.text(x, y - o, txt);
			t.selectAll("tspan:nth-child(n+2)").attr({
				dy: 15,
				x: x
			});
			var g = this.g(t);
			return g;
		};
	});
})(Snap);