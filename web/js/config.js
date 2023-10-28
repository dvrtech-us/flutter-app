function processConfig(config) {

    audioWebsocketUrl = config.audioWebsocketUrl;
    displayWebsocketUrl = config.displayWebsocketUrl;
    gpsWebsocketUrl = config.gpsWebsocketUrl;
    touchScreenWebsocketUrl = config.touchScreenWebsocketUrl;



    setAudioEnabled(config.isAudioEnabled);
    setAudioVolume(config.audioVolume);

    displayRenderer = config.displayRenderer;
    displayBinaryType = config.displayBinaryType;
    displayWidth = config.displayWidth;
    displayHeight = config.displayHeight;

}
function initSockets() {
    if (!displaySocket) createDisplaySocket(displayWebsocketUrl, displayRenderer, displayBinaryType);
    if (!gpsSocket) createGpsSocket(gpsWebsocketUrl);
    if (!touchScreenSocket) createTouchScreenSocket(touchScreenWebsocketUrl);
}
