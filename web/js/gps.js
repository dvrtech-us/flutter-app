var gpsWebsocketUrl;
var gpsSocket;
var gpsEstimator;
var gpsRunning = false;


async function checkPermissionAndStartUpdates() {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

    if (permissionStatus.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // If the permission was just granted, start the location updates
            startLocationUpdates();
        }, (error) => {
            log('Location access has been denied.');
        });
    } else if (permissionStatus.state === 'granted') {
        startLocationUpdates();
    } else {
        log('Location access has been denied.');
    }
}

function createGpsSocket(url) {
    gpsSocket = new ReconnectingWebSocket(url);
    gpsEstimator = new GpsEstimator();

    gpsSocket.onopen = () => {
        log("GPS: Websocket connection established")
        gpsRunning = true;
    };

    gpsSocket.onclose = () => {
        log("GPS: Websocket connection closed")
        gpsRunning = false;
    };

    gpsSocket.onerror = error => {
        log("GPS: " + error);
    };

    gpsSocket.onmessage = (event) => {
        log("GPS: " + message);
    };
}

function updateLocation(position) {
    if (!gpsRunning) return;
    if (!position.coords) return

    gpsSocket.send(toLocationData(position));
}

function logError(error) {
    log(error);
}

function updateHandler() {
    navigator.geolocation.getCurrentPosition(updateLocation, logError);
}

function startLocationUpdates() {
    setInterval(updateHandler, 1000);
}

function toLocationData(position) {
    // We need to set the timestamp anyway, so just reconstruct the structure..
    const pos = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, timestamp: Date.now() };

    const estimate = gpsEstimator.estimate(pos);

    const locationData = JSON.stringify({
        latitude: String(pos.latitude),
        longitude: String(pos.longitude),
        speed: String(estimate.speed),
        bearing: String(estimate.heading),
        vertical_accuracy: String(5/*pos.accuracy*/),
        timestamp: String(pos.timestamp)
    });

    return locationData;
}