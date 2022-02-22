const vscode = require('vscode');

const getConfig = () => {
    return vscode.workspace.getConfiguration('prog-tracker');
}


/** How many ms in 1s */
const SECOND = 1000;
const MINUTE = 60 * SECOND;

/** Minimum watching time for it to be tracked */
const INTERACTION_TRACK_INTERVAL = 5 * SECOND;
/** Minimum watching time for it to be tracked */
const MIN_FILE_TRACK_INTERVAL = 3 * SECOND;
/** Minimum watching time for it to be tracked */
const MAX_TRACK_INTERVAL = 35 * SECOND;
/** Coding tracking inverval  */
const CODING_TRACK_INTERVAL = 1 * SECOND;
/** Max time to wait before consider not coding */
const MAX_CODING_WAIT_TIME = 30 * SECOND;
/** Max time to wait before consider not watching */
const MAX_WATCHING_WAIT_TIME = 60 * SECOND;
/** Time before uploading */
const UPLOAD_INTERVAL = () => {
    return (getConfig().uploadInterval || 60) * SECOND;
} 

const GET_API_URL = () => {
    return getConfig().apiUrl;
}

const GET_API_KEY = () => {
    return getConfig().apiKey;
}


/** If there a event onFileCoding with scheme in here, just ignore this event */
const INVALID_CODING_DOCUMENT_SCHEMES = [
	//there are will be a `onDidChangeTextDocument` with document scheme `git-index`
	//be emitted when you switch document, so ignore it
    'git-index',
    //since 1.9.0 vscode changed `git-index` to `git`, OK, they are refactoring around source control
    //see more: https://code.visualstudio.com/updates/v1_9#_contributable-scm-providers
    'git',
	//when you just look up output channel content, there will be a `onDidChangeTextDocument` be emitted
	'output',
	//This is a edit event emit from you debug console input box
    'input',
    //This scheme is appeared in vscode global replace diff preview editor
    'private',
    //This scheme is used for markdown preview document
    //It will appear when you edit a markdown with aside preview
    'markdown'
];

module.exports = {
    SECOND,
    INTERACTION_TRACK_INTERVAL,
    CODING_TRACK_INTERVAL,
    MAX_CODING_WAIT_TIME,
    MAX_WATCHING_WAIT_TIME,
    INVALID_CODING_DOCUMENT_SCHEMES,
    MIN_FILE_TRACK_INTERVAL,
    MAX_TRACK_INTERVAL,
    UPLOAD_INTERVAL,
    GET_API_URL,
    GET_API_KEY
}