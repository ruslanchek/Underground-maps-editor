(function (Snap) {
	Snap.plugin(function (Snap, Element, Paper, glob) {
		Paper.prototype.multitext = function (x, y, txt) {
			txt = txt.split("\n");
			var t = this.text(x, y, txt);
			t.selectAll("tspan:nth-child(n+2)").attr({
				dy: "1.2em",
				x: x
			});
			return t;
		};
	});
})(Snap);