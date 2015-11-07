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

    this.addVector = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    this.direction = null;
}