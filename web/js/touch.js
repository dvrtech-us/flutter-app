var touchScreenWebsocketUrl;
var touchScreenSocket;

function createTouchScreenSocket(url) {
    touchScreenSocket = new ReconnectingWebSocket(url);

    touchScreenSocket.onopen = () => {
        log("Touch: Websocket connection established")
    };

    touchScreenSocket.onclose = () => {
        log("Touch: Websocket connection closed")
    };

    touchScreenSocket.onerror = error => {
        log("Touch: " + error);
    };

    touchScreenSocket.onmessage = (event) => {
        log("Touch: " + message);
    };
}
//used for Flutterless.html


let touchStartTime = null;

function handleTouchStart(event) {
    let xDown = event.touches[0].clientX;
    let yDown = event.touches[0].clientY;
    console.log('touchstart');
    touchStartTime = new Date().getTime();
    let formattedEvent = buildTouchEvent(8, 13, xDown,
        yDown, true);
    touchScreenSocket.send(formattedEvent);

}


function handleTouchMove(event) {
    event.preventDefault();
    let touch = event.touches[0];


    let formattedEvent = buildTouchEvent(1, 1, touch.clientX,
        touch.clientY, true);
    touchScreenSocket.send(formattedEvent);
    touchStartTime = null;
    console.log(formattedEvent);
}

function scaleXYToDisplaySize(x, y) {

    let xScale = displayWidth / image.width;
    let yScale = displayHeight / image.height;
    x = x * xScale;
    y = y * yScale;
    return [x, y];
}

function handleTouchEnd(event) {
    console.log('touchend');

    if (touchStartTime !== null) {

        touchStartTime = null
        let formattedEvent = buildTouchEvent(8, -1, null,
            null, true);


        touchScreenSocket.send(formattedEvent);


    } else {
        console.log('not a tap')
    }

    /* do nothing */
}



function buildTouchEvent(absMtSlot, absMtTrackingId, absMtPositionX, absMtPositionY, synReport = false) {


    let command = '';
    if (absMtSlot != null) command += 's ' + absMtSlot + '\n';
    if (absMtTrackingId != null) {
        command += 'T ' + absMtTrackingId + '\n';
        if (absMtTrackingId == -1) {
            command += 'a 0\n';
        } else {
            command += 'a 1\n';
        }
    }
    if (absMtPositionX != null && absMtPositionY != null) {
        console.log(absMtPositionX + ' ' + absMtPositionY)
        let scaledXY = scaleXYToDisplaySize(absMtPositionX, absMtPositionY);
        absMtPositionX = parseInt(scaledXY[0]);
        absMtPositionY = parseInt(scaledXY[1]);

    }

    if (absMtPositionX != null) command += 'X ' + absMtPositionX + '\n';
    if (absMtPositionY != null) command += 'Y ' + absMtPositionY + '\n';
    if (synReport) command += 'e 0\nS 0\n';
    console.log(command);
    return command;
}

//technically only used for testing on a desktop. 
function handleMouseDown(event) {
    let formattedEvent = buildTouchEvent(8, 13, event.clientX,
        event.clientY, true);
    touchScreenSocket.send(formattedEvent);
    touchStartTime = new Date().getTime();
}

function handleMouseMove(event) {
    console.log(event.buttons);
    if (event.buttons === 1) { // Check if left mouse button is down
        let formattedEvent = buildTouchEvent(1, 1, event.clientX,
            event.clientY, true);
        touchScreenSocket.send(formattedEvent);
        touchStartTime = null;
    }
}

function handleMouseUp(event) {
    if (touchStartTime !== null) {

        touchStartTime = null
        let formattedEvent = buildTouchEvent(8, -1, null,
            null, true);
        touchScreenSocket.send(formattedEvent);
    }

}