const vscode = require('vscode');
const { onFileCoding, onActiveFileChange, onInteraction } = require('./src/fileService');
const EMPTY = { document: null, textEditor: null };

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let subscriptions = context.subscriptions;

	onActiveFieChange(((vscode.window.activeTextEditor || EMPTY).document));
	createStatusBar();
	subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => onFileCoding((e || EMPTY).document)));
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => onActiveFileChange((e || EMPTY))));
    subscriptions.push(vscode.window.onDidChangeTextEditorSelection(e => onInteraction((e || EMPTY).document)  ));

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "prog-tracker" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('prog-tracker.activate', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Welcome to Prog Tracker!');
	});

	subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
	onActiveFileChange(null);
 }

const createStatusBar = () => {
	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.text = `$(clock) Prog-Tracker`;
	myStatusBarItem.tooltip = "Prog-Tracker is Active!";
	myStatusBarItem.show();
}

module.exports = {
	activate,
	deactivate
}
