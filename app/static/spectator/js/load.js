var loadState = {

    preload: function() {

        /*
        Load all game assets
        Place your load bar, some messages.
        In this case of loading, only text is placed...
        */

        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#fff'});

        //Load your images, spritesheets, bitmaps...
        game.load.image('ball-red', 'static/spectator/assets/img/ball-red.png');
        game.load.image('ball-blue', 'static/spectator/assets/img/ball-blue.png');
        game.load.image('ball-green', 'static/spectator/assets/img/ball-green.png');
        game.load.image('ball-orange', 'static/spectator/assets/img/ball-orange.png');
        game.load.image('ball-pink', 'static/spectator/assets/img/ball-pink.png');
        game.load.image('ball-purple', 'static/spectator/assets/img/ball-purple.png');


        //Load your sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');

        //Load your data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function() {

        game.stage.setBackgroundColor('#000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('play');
    }
};
