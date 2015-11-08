
$(document).ready(function() {
    updater.start();
});


var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(event.data);
        }
    },

    showMessage: function(message) {
        console.clear();
        console.log(message);
    }
};
