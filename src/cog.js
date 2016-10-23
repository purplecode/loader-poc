function cog(size) {
    var props = {
        d1: 1,
        d2: .69,
        d3: .37,
        teeth: 7,
        splay: 0.375,
        fill: 'black'
    };

    var c = size / 2;

    var r1 = props.d1 * size / 2;
    var r2 = props.d2 * size / 2;
    var r3 = props.d3 * size / 2;

    var angle = 360 / props.teeth;
    var offset = 90;

    var rad = a => Math.PI * a / 180;
    var rx = (r, a) => c + r * Math.cos(rad(a));
    var ry = (r, a) => c + r * Math.sin(rad(a));
    var num = n => (n < 0.0000001) ? 0 : n;

    var ta = angle / 4;
    var splay = props.splay * ta;
    var tw = Math.tan(rad(ta - splay)) * r1;


    var tx = (a, w) => Math.sin(rad(a)) * w;
    var ty = (a, w) => Math.cos(rad(a)) * w;

    var teeth = function () {
        var d = [];
        for (var i = 0; i < props.teeth; i++) {
            var a = angle * i - offset;
            var a1 = a + ta + splay;
            var a2 = a + angle - ta - splay;
            var line = [
                (i === 0) ? 'M' : 'L',
                num(rx(r1, a) + tx(a, tw)),
                num(ry(r1, a) - ty(a, tw)),
                'L',
                num(rx(r1, a) - tx(a, tw)),
                num(ry(r1, a) + ty(a, tw)),
                'L',
                num(rx(r2, a1)),
                num(ry(r2, a1)),
                'A', r2, r2,
                '0 0 1',
                num(rx(r2, a2)),
                num(ry(r2, a2))
            ].join(' ');
            d.push(line)
        }
        return d.join(' ')
    };

    var hole = function () {
        return [
            'M', c, c - r3,
            'A', r3, r3,
            '0 0 0',
            c, c + r3,
            'A', r3, r3,
            '0 0 0',
            c, c - r3
        ].join(' ')
    };

    return [
        teeth(),
        hole()
    ].join(' ')
}


