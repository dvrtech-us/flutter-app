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


var touchCapture = document.getElementById('touchCapture');
touchCapture.addEventListener('touchstart', handleTouchStart, false);
touchCapture.addEventListener('touchmove', handleTouchMove, { passive: false });
touchCapture.addEventListener('touchend', handleTouchEnd, false);

var xDown = null;
var yDown = null;

var touchStartTime = null;
function handleTouchStart(event) {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    console.log('touchstart');
    touchStartTime = new Date().getTime();
    let formattedEvent = buildTouchEvent(8, 13, xDown,
        yDown, true);
    touchScreenSocket.send(formattedEvent);

}


function handleTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];


    let formattedEvent = buildTouchEvent(1, 1, touch.clientX,
        touch.clientY, true);
    touchScreenSocket.send(formattedEvent);
    touchStartTime = null;
    console.log(formattedEvent);
}

function scaleXandYToDisplaySize(x, y) {

    var xScale = displayWidth / image.width;
    var yScale = displayHeight / image.height;
    x = x * xScale;
    y = y * yScale;
    return [x, y];
}

function handleTouchEnd(event) {
    console.log('touchend');

    if (touchStartTime !== null) {
        var touchEndTime = new Date().getTime();
        var touchDuration = touchEndTime - touchStartTime;
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


    var command = '';
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
        var scaledXY = scaleXandYToDisplaySize(absMtPositionX, absMtPositionY);
        absMtPositionX = scaledXY[0];
        absMtPositionY = scaledXY[1];
        absMtPositionX = parseInt(absMtPositionX);
        absMtPositionY = parseInt(absMtPositionY);
    }

    if (absMtPositionX != null) command += 'X ' + absMtPositionX + '\n';
    if (absMtPositionY != null) command += 'Y ' + absMtPositionY + '\n';
    if (synReport) command += 'e 0\nS 0\n';
    console.log(command);
    return command;
}