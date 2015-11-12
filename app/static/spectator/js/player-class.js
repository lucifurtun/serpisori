function Player(id, x, y, color, gyro, index){
    this.index = index;
    this.id = id;
    this.trackSegmentLength = 50;
    this.position = new Point(x, y);
    this.color = color || '#ff00aa';
    this.direction = new Point(x, y);
    this.trackPoints = [];
    this.lastTrackPoint = new Point(x, y);
    this.gyroObject = gyro;
    this.step = 2.3;
    this.radius = 20;

    /*this.bmd = game.add.bitmapData(this.radius*2, this.radius*2);
    this.bmd.circle(this.radius, this.radius, this.radius, this.color);
    this.bmd.circle(this.radius, this.radius, this.radius*0.7, '#fff');*/

    //this.sprite = game.add.sprite(game.width / 2, game.height / 2, this.bmd);
    //this.sprite.anchor.set(0.5);
    //game.add.tween(this.sprite.scale).to( { x: 1.2, y: 1.2 }, 200, Phaser.Easing.Linear.None, true, 0, 1000, true);

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
            this.renderTrack();
        }
    };
    this.updatePosition = function(){
        var sprite = gameObj.playerSpritesList[this.index];
        //console.log(gameObj.playerList);
        //console.log(gameObj.playerSpritesList);
        this.position.x += this.direction.x * this.step;
        this.position.y += this.direction.y * this.step;
        /*this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;*/

        sprite.x = this.position.x;
        sprite.y = this.position.y;

        this.checkLastTrackDistance(this.lastTrackPoint, this.position);
    };

    this.renderTrack = function(){
        gameObj.playerTrackBitmapData.circle(this.position.x, this.position.y, 5, this.color);
        var trackLength = this.trackPoints.length;
        if(trackLength > 1){
            var p1 = this.trackPoints[trackLength-2];
            var p2 = this.trackPoints[trackLength-1];
            gameObj.playerTrackBitmapData.line(p1.x, p1.y, p2.x, p2.y, this.color, 2);
        }
        gameObj.playerTrackBitmapData.dirty = true;
    };
}

