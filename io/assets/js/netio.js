class NetIO {

    /**
     * Constructor
     * @param {string} wsUri 
     */
    constructor(wsUri) {
        this.ws = new WebSocket(wsUri);
        this.channel = "d"; // default channel

        let self = this;

        this.onData = function (e) {};

        this.ws.onmessage = function (e) {
            self.onMessage(e);
        };

        this.ws.onopen = function (e) {
            self.onOpen(e);
        }
    }

    /**
     * Send message over selected channel
     * @param {string} text 
     */
    send(text) {
        let b64Text = btoa(text);
        let message = `{"c":"${this.channel}","m":"${b64Text}"}`;
        this.ws.send(message);
    }
    
    /**
     * Wait for socket connection then callback
     * @param {*} callback 
     */
    waitForConnection(callback) {
        let self = this;
        setTimeout(
            function () {
                if (self.ws.readyState === 1) {
                    if (callback != null) {
                        callback();
                    }
                } else {
                    self.waitForConnection(callback);
                }
    
            }, 10);
    }

    onMessage(e) {
        let text = atob(e.data);
        this.onData(text);
        console.log(`received data=${text}`);
    }
    
    onOpen(e) {
        this.connected = true;
    }
}