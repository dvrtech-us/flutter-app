var displayRenderer;
var displayBinaryType;
var displayWidth;
var displayHeight;
var displayRendererAdded = false;

var displayWebsocketUrl;
var displaySocket;

function createDisplaySocket(url, renderer, binaryType) {
    if (!displayRendererAdded) {
        //var rendererScript = document.createElement('script');
        //rendererScript.src = renderer + '.js';
        //document.head.appendChild(rendererScript);
        var img = document.getElementById("image");
        var canvas = document.getElementById("canvas");
        img.style.display = "block";
        img.src = url;
        canvas.style.display = "none";
        displayRendererAdded = true;

        checkVideoStream();
    }

    //displaySocket = new ReconnectingWebSocket(url, null, { binaryType: binaryType });

    //displaySocket.onopen = () => {
    //  log("Display: Websocket connection established");
    //};

    //displaySocket.onclose = () => {
    //  log("Display: Websocket connection closed")
    //};

    //displaySocket.onerror = error => {
    //  log("Display: " + error)
    //};

    //displaySocket.onmessage = (event) => {
    //  drawDisplayFrame(event.data);
    //};
}

async function checkVideoStream() {
    while (true) {
        try {
            await image.decode();
        } catch {
            let src = image.src;
            image.src = "";
            image.src = src;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}