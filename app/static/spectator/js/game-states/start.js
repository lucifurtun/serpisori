var playersSpriteGroup = null;
var playersTrackSpriteGroup = null;
var startState = {

    activePlayers: [],
    playersBmd: null,
    playersSprite: null,
    preload: function () {

        //Load your images, spritesheets, bitmaps...

        //Load your sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');

        //Load your data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {
        websocket.socketStart();
        this.playersBmd = game.add.bitmapData(game.width, game.height);
        this.playersBmd.text('Waiting for players ...', 80, 150, '30px Courier', '#fff');
        this.playersSprite = game.add.sprite(0, 0, this.playersBmd);
    },

    update: function () {
        for (var i = 0; i < gameObj.playerList.length; i++) {
            if (this.activePlayers.indexOf(gameObj.playerList[i].id) < 0) {
                this.activePlayers.push(gameObj.playerList[i].id);
                this.playersBmd.text(gameObj.playerList[i].id, 80, 250+(60*i), '30px Courier', '#fff');
                this.playersBmd.dirty = true;
            }
        }
        if (gameObj.playerList.length >= 3) {
            game.state.start('play');
        }
    }
};
