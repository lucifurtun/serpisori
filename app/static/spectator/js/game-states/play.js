var playState = {
    create: function () {
        gameObj.playerTrackBitmapData = game.add.bitmapData(game.width, game.height);
        gameObj.playerTrackSprite = game.add.sprite(0, 0, gameObj.playerTrackBitmapData);

        if (window.location.hash === '#debug') {
            game.add.plugin(Phaser.Plugin.Debug);
            game.add.plugin(Phaser.Plugin.Inspector);
        }

        for (var i = 0; i < gameObj.playerList.length; i++) {
            var radius = gameObj.playerList[i].radius;
            var color = gameObj.playerList[i].color;
            var bmd = game.add.bitmapData(radius*2, radius*2);
            var sprite;

            bmd.circle(radius, radius, radius, color);
            bmd.circle(radius, radius, radius*0.7, '#fff');

            sprite = game.add.sprite(game.width / 2, game.height / 2, bmd);
            sprite.anchor.set(0.5);
            game.add.tween(sprite.scale).to( { x: 1.2, y: 1.2 }, 200, Phaser.Easing.Linear.None, true, 0, 1000, true);

            gameObj.playerSpritesList.push(sprite);
        }
    },

    update: function () {
        //console.log(this.playerList);
        for (var i = 0; i < gameObj.playerList.length; i++) {
            var player = gameObj.playerList[i];
            player.updatePosition();
        }
    }
};
