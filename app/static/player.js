$(document).ready(function () {

    //if(!gyro.hasFeature('gyro')) {
    //    window.location = '/player-interface';
    //}

    updater.start();
    gyro.frequency = 100;
    var output = null;
    gyro.startTracking(function (o) {
        output = o;
        return false;
    });

    setInterval(function () {
        sendData(output);
    }, 100);
});

function sendData(o) {
    if (!updater.playerId) {
        return
    }

    var coordinates = {
        id: updater.playerId,
        beta: o.beta,
        gamma: o.gamma
    };

    updater.socket.send(JSON.stringify(coordinates));
    console.log(JSON.stringify(coordinates));
}

var updater = {
    socket: null,
    playerId: null,

    start: function () {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if ("join" === data.type) {
                updater.playerId = data.id;
            }
        };
    }
};
