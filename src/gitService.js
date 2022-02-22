const vscode = require('vscode');


const getRepo = () => {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    const repo = gitExtension.getAPI(1).repositories[0];
    if (!repo) {
		vscode.window.showErrorMessage('Not able to find git repository.');
    }
    return repo;
}

const getCurrentBranchInfo = (repo) =>{
    const branch = repo.state.HEAD;
    return branch;
}

const getGitInfoFromFile = () => {
    const repo = getRepo();
    if (!repo) return null;
    const branchInfo = getCurrentBranchInfo(repo);
    if (!branchInfo) return null
    return {
        lastCommitHash: branchInfo.commit,
        branch: branchInfo.name,
    };
}

module.exports = {
    getGitInfoFromFile
}
