const vscode = require('vscode');
const { GET_API_URL, GET_API_KEY } = require('./config');
const axiosRetry = require('axios-retry');
const axios = require('axios');
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

const uploadTrackBuffer = async(trackBuffer) => {
    try {
        const url = GET_API_URL();
        const key = GET_API_KEY();
        if(key == null || url == null) {
            vscode.window.showErrorMessage("Please set API key and URL in settings.");
            return null;
        }
        const response = await axios.post(url, {
            api_key: key,
            data: trackBuffer
        });
        if (response.data) {
            console.log(`Uploaded ${trackBuffer.length} track data`);
            return true;
        }
        return false;
    } catch (error) {
        vscode.window.showErrorMessage("Not able to send data to API: " + error.message);
        return false;
    }
}

module.exports = {
    uploadTrackBuffer
}