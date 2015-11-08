$(document).ready(function() {

    //if(!gyro.hasFeature('gyro')) {
    //    window.location = '/player-interface';
    //}

    updater.start();
    gyro.frequency = 100;
    var output = null;
    gyro.startTracking(function(o) {
        output = o;
        return false;
    });

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
