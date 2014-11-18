(function (Snap) {
	Snap.plugin(function (Snap, Element, Paper, glob) {
		Paper.prototype.multitext = function (x, y, txt) {
			var txt_1 = txt.split("\n");

			if(txt_1.length > 1){
                var o = 0;

				for (var i = 0; i < txt_1.length; i++) {
					o += 9 * i;
				}

                var t = this.text(x, y - o, txt_1);

                t.selectAll("tspan:nth-child(n+2)").attr({
                    dy: 15,
                    x: x
                });

                var g = this.g(t);

                return g;


            }else{
                var t = this.text(x, y, txt);

                return t;
            }
		};
	});
})(Snap);