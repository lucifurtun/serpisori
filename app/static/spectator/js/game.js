(function () {

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var counter = 0;

    var width = canvas.width = 800;
    var height = canvas.height = 400;

    var body = document.getElementsByTagName('body')[0];

    body.appendChild(canvas);

    var clearCanvas = function () {
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);
    };

    var drawFrames = function () {
        context.font = "30px Arial";
        context.fillText("" + counter, 10, 50);
        counter++;
    };

    var dot = {
        width: 10,
        height: 10,
        color: '#ff0000',
        moveDirection: "right",
        position: {
            x: 0,
            y: 0
        },

        updatePosition: function () {
            switch (this.moveDirection) {
                case 'left':
                    this.position.x--;
                    break;
                case 'right':
                    this.position.x++;
                    break;
                case 'up':
                    this.position.y--;
                    break;
                case 'down':
                    this.position.y++;
                    break;

            }
        },

        render: function () {
            this.updatePosition();
            context.fillStyle = this.color;
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    };

    document.onkeydown = function (e) {
        e.preventDefault();
        console.log(e.keyCode);
        switch (e.keyCode) {
            case 37:
                dot.moveDirection = "left";
                break;
            case 39:
                dot.moveDirection = "right";
                break;
            case 38:
                dot.moveDirection = "up";
                break;
            case 40:
                dot.moveDirection = "down";
                break;
        }

        console.log(dot.position);
    };

    var render = function () {
        clearCanvas();
        dot.render();
        drawFrames();
    };

    setTimeout(function () {

        (function animloop() {
            window.requestAnimationFrame(animloop);
            render();
        })();

    }, 100);

})();

