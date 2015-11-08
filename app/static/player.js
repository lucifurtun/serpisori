
$(document).ready(function() {
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
            updater.showMessage(JSON.parse(event.data));
        }
    },

    showMessage: function(message) {
//        $("#inbox").html(message);
    }
};
