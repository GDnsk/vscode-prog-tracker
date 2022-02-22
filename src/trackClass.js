const _ = require('lodash');
const {getGitInfoFromFile} = require("./gitService");

/**
 * Class structure for saving tracks
 */
class TrackData{
    constructor(file, trackData, gitInfo){
        this.file = _.cloneDeep(file);
        this.trackData = _.cloneDeep(trackData);
        this.gitInfo = _.cloneDeep(gitInfo);
    }
}

module.exports = TrackData;