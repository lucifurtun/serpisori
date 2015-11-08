$(document).ready(function() {
    var output = null;
    gyro.frequency = 100;
    gyro.startTracking(function(o) {
        output = o;
        if(!o.beta  || !o.gamma ) {
            window.location = '/player-interface';
        }
        return false;
    });

    updater.start();

    setInterval(function(){
        sendCoordinates(output);
    }, 100);
});

function sendCoordinates(o) {
    var coordinates = {
        beta: o.beta,
        gamma: o.gamma
    };

    updater.socket.send(JSON.stringify(coordinates));
    console.log(JSON.stringify(coordinates));
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
        };
        updater.socket.onopen = function () {
            updater.socket.send(JSON.stringify({
                "type": "join"
            }))
        };
        updater.socket.onclose = function () {
            updater.socket.send(JSON.stringify({
                "type": "leave"
            }))
        };
    }
};
