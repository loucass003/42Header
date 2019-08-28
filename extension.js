// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "42headers" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	const watcher = vscode.workspace.createFileSystemWatcher("**/*.h", false, true, true);
	
	watcher.onDidCreate(function(e) {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		if (activeEditor.document.uri.path === e.path)
			return ;

		vscode.commands.executeCommand(
			'42header.insertHeader',
			activeEditor.document.uri,
			activeEditor.selection.active
		).then((data) => {
			activeEditor.document.save().then(() => {
				vscode.window.activeTextEditor.edit(edit => {
					console.log(e);
					const name = path.basename(e.path, '.h').toUpperCase();
					var indexA = new vscode.Position(13,0)
					edit.insert(indexA, `#ifndef ${name}_H\n# define ${name}_H\n\n\n\n#endif`);
					console.log("heeeeho", edit);
				}).then(data => {
					const editor = vscode.window.activeTextEditor;
					var newSelection = new vscode.Selection(new vscode.Position(15,0), new vscode.Position(15,0));
					editor.selection = newSelection;
					activeEditor.document.save();
				})
				.catch(err => console.log(err));
			});
		});
	})
	context.subscriptions.push(watcher);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
