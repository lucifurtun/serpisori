var websocket = {
    socket: null,

    socketStart: function() {
        var url = "ws://" + location.host + "/chatsocket";
        this.socket = new WebSocket(url);
        this.socket.onmessage = function(event) {
            websocket.showMessage(event.data);
        }
    },

    showMessage: function(data) {
        gameObj.processGyroData(data);
    }
};