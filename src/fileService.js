const vscode = require('vscode');
const _ = require('lodash');
const { INTERACTION_TRACK_INTERVAL, CODING_TRACK_INTERVAL, UPLOAD_INTERVAL, INVALID_CODING_DOCUMENT_SCHEMES, MIN_FILE_TRACK_INTERVAL, MAX_TRACK_INTERVAL } = require("./config");
const { uploadTrackBuffer } = require("./uploadService");
const TrackData = require("./trackClass");
const { isIgnoreDocument } = require("./ignoreDocList");
const { getGitInfoFromFile } = require("./gitService");


let trackBuffer = [];

/** current active document*/
let activeDocument;

/** Tracking data, record document open time, first coding time and last coding time and coding time long */
let trackData = {
    startTrackingTime:null,
    firstCodingTime: null,
    lastCodingTime: null,
    lastInteractionTime: null,
    endTrackinTime: null
};

/**
 * Saving track data
 * @param {number} now
 */
 const saveTrackData = async(now) => {
    if (!isIgnoreDocument(activeDocument)) {
        if (shouldUploadTrackBuffer()) {
            await uploadTrackBufferHandler();
        }
        trackData.lastInteractionTime = now;
        trackData.endTrackinTime = now;
        const gitInfo = await getGitInfoFromFile();
        trackBuffer.push(new TrackData(activeDocument, trackData, gitInfo));
    }
}

const resetAllMetrics = () => {
    const now = Date.now();
    trackData = {
        startTrackingTime:now,
        firstCodingTime: null,
        lastCodingTime: null,
        lastInteractionTime: now,
        endTrackinTime: null
    };
}

/** Check file conditions and last track to determine if should track */
const shouldTrackCoding = (doc) => {
    if (!activeDocument)
        return false;

    // Ignore the invalid coding file schemes
    if (!doc || INVALID_CODING_DOCUMENT_SCHEMES.indexOf(doc.uri.scheme) >= 0)
    return;  

    if (Date.now() - trackData.lastCodingTime < CODING_TRACK_INTERVAL) return false;
    // console.log(`shouldTrackCoding: ${Date.now() - trackData.lastCodingTime} >= ${CODING_TRACK_INTERVAL}`);
    return true;
}

/** Check file conditions and last track to determine if should track */
const shouldTrackInteraction = () => {
    if (!activeDocument)
        return false;
    // // Ignore the invalid coding file schemes
    // if (!doc || INVALID_CODING_DOCUMENT_SCHEMES.indexOf(doc.uri.scheme) >= 0)
    // return;  
    if (Date.now() - trackData.lastInteractionTime < INTERACTION_TRACK_INTERVAL) return false;
    // console.log(`shouldTrackInteraction: ${Date.now() - trackData.lastInteractionTime} >= ${INTERACTION_TRACK_INTERVAL}`);
    return true;
}

const shouldSaveTrackDataOnChangeFile = (doc) => {
    if (Date.now() - trackData.startTrackingTime < MIN_FILE_TRACK_INTERVAL ) return false;
    // console.log(`shouldSaveTrackDataOnChangeFile: ${Date.now() - trackData.startTrackingTime} >= ${MIN_FILE_TRACK_INTERVAL}`);
    // Ignore the invalid coding file schemes
    if (!doc || INVALID_CODING_DOCUMENT_SCHEMES.indexOf(doc.uri.scheme) >= 0) return false;  
    return true;
}

const shouldSaveTrackDataByInterval = () => {
    // console.log(`shouldSaveTrackDataByInterval: ${Date.now() - trackData.startTrackingTime} >= ${MAX_TRACK_INTERVAL}`);
    if (Date.now() - trackData.startTrackingTime >= MAX_TRACK_INTERVAL ) return true;
    return false;
}

const shouldUploadTrackBuffer = () => {
    // console.log(`shouldUploadTrackBuffer: ${trackBuffer.length}`);
    if (trackBuffer.length <= 0) return false;
    // console.log(`shouldUploadTrackBuffer: ${Date.now() - trackBuffer[0].trackData.startTrackingTime} >= ${UPLOAD_INTERVAL()}`);
    if (Date.now() - trackBuffer[0].trackData.startTrackingTime >= UPLOAD_INTERVAL()) return true;
    return false;
}

const uploadTrackBufferHandler = async() => {
    const trackBufferCopy = _.cloneDeep(trackBuffer);
    trackBuffer = [];
    const response = await uploadTrackBuffer(trackBufferCopy);
    console.log(`uploadTrackBufferHandler: ${response}`);
    if (response == true) {
        trackBuffer = [];
        vscode.window.showInformationMessage('Uploading track buffers...');
    }else{
        trackBuffer = trackBufferCopy;
    }
}

const updateActiveDocument = (doc) => {
    if (!doc) return;
    console.log(`updateActiveDocument: ${doc ? doc.fileName : 'no file'}`);
    activeDocument = _.cloneDeep(doc);
}

/** @param {vscode.TextDocument} doc */
const onActiveFileChange = async(e) => {
    if (e.document == null) return;
    if(shouldSaveTrackDataOnChangeFile(activeDocument)){
        await saveTrackData(Date.now(), activeDocument);
    } 
    resetAllMetrics();
    updateActiveDocument(e.document);
}

const onFileCoding = async(doc) => {
    // console.log(`onFileCoding: ${doc.fileName}`);
    
    if (!shouldTrackCoding(doc)) return;

    let now = Date.now();

    //If is first time coding in this file, record time
    if (!trackData.firstCodingTime)
        trackData.firstCodingTime = now;

    trackData.lastCodingTime = now;
}

/** Triggered when cursor or selection changes and when any key is pressed. 
 * Triggered after onFileCoding. */
const onInteraction = async(doc) => {
    // console.log(`onInteraction: ${doc ? doc.fileName || 'no file' : 'no file'}`);
    if (!shouldTrackInteraction(doc)) return;

    if (shouldSaveTrackDataByInterval()) {
        await saveTrackData(Date.now(), activeDocument);
        resetAllMetrics();
    }

    trackData.lastInteractionTime = Date.now();
}

module.exports = {
    onFileCoding,
    onActiveFileChange,
    onInteraction
}