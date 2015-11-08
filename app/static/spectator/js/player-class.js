function Player(id, sprite, x, y, color){
    this.id = id;
    this.trackSegmentLength = 50;
    this.sprite = sprite;
    this.position = new Point(x, y);
    this.color = color || '#ff00aa';
    this.direction = new Point(x, y);
    this.trackPoints = [];
    this.lastTrackPoint = new Point(x, y);
    this.setLastTrackPoint = function(p){
        this.lastTrackPoint = new Point(p.x, p.y);
    };
    this.saveNewTrackPoint = function(p){
        this.trackPoints.push(new Point(p.x, p.y));
    };
    this.checkLastTrackDistance = function(p1, p2){
        var distance = getLineDistance(p1, p2);
        if(distance >= this.trackSegmentLength){
            this.saveNewTrackPoint(p2);
            this.setLastTrackPoint(p2);
        }
    };
    this.updatePosition = function(){
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;

        this.checkLastTrackDistance(this.lastTrackPoint, this.position);
    };
}

