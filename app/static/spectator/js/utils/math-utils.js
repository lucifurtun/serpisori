function Vector(p1, p2) {
    this.x = p1.x - p2.x;
    this.y = p1.y - p2.y;

    this.normalize = function () {
        var norm = this;
        return {
            x: -norm.x / norm.length(),
            y: -norm.y / norm.length()
        };
    };
    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getLineDistance(p1, p2) {
    var xs;
    var ys;

    xs = p2.x - p1.x;
    xs = xs * xs;

    ys = p2.y - p1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}