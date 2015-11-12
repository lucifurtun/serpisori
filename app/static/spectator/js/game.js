var gameObj = {
    playerList : [],
    playerSpritesList : [],
    playerTrackBitmapData: null,
    playerTrackSprite: null,
    positionFromClient: null,
    nextDirectionFromClient: {x: 0, y: 0},
    colorList: ['#ff00aa', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#3498db', '#ecf0f1', '#7f8c8d'],
    socket: null,
    playersTrackSpriteGroup: null,
    getNewPlayerInstance: function (gyro) {
        var id = gyro.id;
        var index = this.playerList.length;
        var colorIndex = this.playerList.length % this.colorList.length;

        var newPlayer = new Player(
            id,
            game.width / 2,
            game.height / 2,
            this.colorList[colorIndex],
            gyro,
            index
        );

        this.savePlayerToList(newPlayer);

        return newPlayer
    },
    getPlayerById: function (gyro) {
        var id = gyro.id;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].id === id) {
                return this.playerList[i];
            }
        }
        return this.getNewPlayerInstance(gyro);
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
        var currentPlayer;
        if (gyroObject.type === 'join') {
            return;
        }
        currentPlayer = this.getPlayerById(gyroObject);
        currentPlayer.direction = this.getDirectionFromGyroData(gyroObject);
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
    }
};