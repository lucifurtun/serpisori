var playState = {
    sprite: null,
    bmd: null,
    snakeBmd: null,
    currentDirection: null,
    pointerDown: false,
    positionFromClient: null,
    nextDirectionFromClient: {x: 0, y: 0},
    socket: null,
    socketStart: function () {
        var self = this;
        var url = "ws://" + location.host + "/chatsocket";
        this.socket = new WebSocket(url);
        this.socket.onmessage = function (event) {
            self.positionFromClient = self.getObjectFromGyroString(event.data);
            self.nextDirectionFromClient = self.getDirectionFromGyroData();
            console.clear();
            console.log(self.nextDirectionFromClient);
            console.log(event.data);
        }
    },
    getObjectFromGyroString: function (gyroData) {
        return JSON.parse(gyroData);
    },
    getDirectionFromGyroData: function () {
        var beta = this.positionFromClient.beta;
        var gamma = this.positionFromClient.gamma;
        var startPoint = new Point(0, 0);
        var endPoint = new Point(beta, -gamma);
        var vector = new Vector(startPoint, endPoint);

        return vector.normalize();
    },
    create: function () {
        this.socketStart();
        if (window.location.hash === '#debug') {
            game.add.plugin(Phaser.Plugin.Debug);
            game.add.plugin(Phaser.Plugin.Inspector);
        }

        //	This is the sprite we're going to be drawing onto the BitmapData
        //	We use game.make because we don't need it displayed, we just need it to exist
        this.sprite = game.make.sprite(game.width / 2, game.height / 2, 'Dall');
        this.sprite.anchor.set(0.5);

        //	Note that any properties you set here will be replicated when the Sprite is drawn
        // loop.scale.set(2);

        //	This is the BitmapData we're going to be drawing to

        this.snakeBmd = game.add.bitmapData(game.width, game.height);
        this.bmd = game.add.bitmapData(200, 200);

        //this.bmd.addToWorld();
        game.add.sprite(30, game.height - 240, this.bmd);
        this.snakeBmd.addToWorld();
        //game.add.sprite(0,0, this.bmd);

        //	Disables anti-aliasing when we draw sprites to the BitmapData
        this.bmd.smoothed = false;

        //game.input.addMoveCallback(this.paint, this);
    },

    update: function () {
        this.sprite.x += this.nextDirectionFromClient.x;
        this.sprite.y += this.nextDirectionFromClient.y;
        this.snakeBmd.draw(this.sprite, this.sprite.x, this.sprite.y);
    },

    paint: function (pointer, x, y) {
        //console.log(pointer);
        this.bmd.clear();

        this.bmd.circle(100, 100, 100, 'rgba(255,255,255,1)');
        if (pointer.isDown) {
            this.pointerDown = true;
            var startPoint = new Point(pointer.positionDown.x, pointer.positionDown.y);
            var endPoint = new Point(x, y);

            var vector = new Vector(startPoint, endPoint);
            var direction = vector.normalize();
            this.currentDirection = direction;
            console.log(this.sprite.x);

            this.sprite.x += direction.x;
            this.sprite.y += direction.y;
            //this.bmd.circle(x, y, 20, 'red');
        } else {
            this.pointerDown = false;
        }
        /*} else if(this.currentDirection !== null){
         this.sprite.x += this.currentDirection.x;
         this.sprite.y += this.currentDirection.y;
         }*/
    }
};
