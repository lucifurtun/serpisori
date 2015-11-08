var playState = {
    sprite: null,
    playerList: [],
    playerTrackBitmapData: null,
    positionFromClient: null,
    nextDirectionFromClient: {x: 0, y: 0},
    colorList: ['#2cc36b', '#f1c40f', '#1abc9c', '#9b59b6', '#e74c3c', '#e67e22', '#3498db'],
    socket: null,
    counter: 0.1,
    getPlayerById: function (id) {
        id = id || 'unique';
        //console.log('ID = ', id);
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].id === id) {
                return this.playerList[i];
            }
        }
        var sprite = game.make.sprite(game.width / 2, game.height / 2, 'Dall');
        sprite.anchor.set(0.5);
        var playersCount = this.playerList.length;
        this.savePlayerToList(new Player(id, sprite, game.width / 2, game.height / 2, this.colorList[playersCount + 1]));
        return this.playerList[this.playerList.length - 1];
    },
    savePlayerToList: function (player) {
        this.playerList.push(player);
    },
    registerClient: function (data) {
        //if ("join" === data.type) {
        //    this.savePlayerToList(new Player(data.id, null, game.width / 2, game.height / 2, this.colorList[playersCount + 1]));
        //}
    },
    processGyroData: function (data) {
        var gyroObject = this.getObjectFromGyroString(data);
        //console.log(this.playerList);
        var currentPlayer = this.getPlayerById(gyroObject.id);
        currentPlayer.direction = this.getDirectionFromGyroData(gyroObject);
        //console.clear();
        //console.log(data);
    },
    onMessageSocketCallback: function (event) {
        this.registerClient(event.data);
        this.processGyroData(event.data);
    },
    socketStart: function () {
        var url = "ws://" + location.host + "/chatsocket";
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onMessageSocketCallback.bind(this);
    },
    getObjectFromGyroString: function (gyroData) {
        return JSON.parse(gyroData);
    },
    getDirectionFromGyroData: function (gyroObject) {
        var beta = gyroObject.beta || 0;
        var gamma = gyroObject.gamma || 0;
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

        this.sprite = game.make.sprite(game.width / 2, game.height / 2, 'Dall');
        this.sprite.anchor.set(0.5);

        //	Note that any properties you set here will be replicated when the Sprite is drawn
        // loop.scale.set(2);

        this.playerTrackBitmapData = game.add.bitmapData(game.width, game.height);
        //this.playerTrackBitmapData.addToWorld();
        game.add.sprite(0, 0, this.playerTrackBitmapData);

        //	Disables anti-aliasing when we draw sprites to the BitmapData
    },

    update: function () {
        this.playerTrackBitmapData.clear();
        for (var i = 0; i < this.playerList.length; i++) {
            var player = this.playerList[i];
            //console.log(player.direction);
            player.position.x += player.direction.x;
            player.position.y += player.direction.y;
            //this.playerTrackBitmapData.draw(player.sprite, player.sprite.x, player.sprite.y);
            console.log(player.position.x, player.position.y, player.color);

            this.playerTrackBitmapData.circle(player.position.x, player.position.y, 15, player.color);

            //console.log(player.position);
        }
    }
};
