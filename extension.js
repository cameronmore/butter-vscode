'use strict';

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

let client = null;

function activate(context) {
	const extensionRoot = fs.realpathSync(context.extensionPath);
	const config = vscode.workspace.getConfiguration('butter');
	const bunPath = config.get('bunPath') || 'bun';
	const nodePath = config.get('nodePath') || 'node';
	const analyzerPath = config.get('analyzerPath') || defaultAnalyzerPath(extensionRoot);
	const serverCwd = path.join(extensionRoot, '..', 'lsp');
	const builtServerModule = path.join(serverCwd, 'dist', 'server.js');
	const sourceServerModule = path.join(serverCwd, 'src', 'server.ts');
	const useBuiltServer = fs.existsSync(builtServerModule);

	const serverOptions = {
		command: useBuiltServer ? nodePath : bunPath,
		args: useBuiltServer ? [builtServerModule, '--stdio'] : ['run', sourceServerModule, '--stdio'],
		options: {
			cwd: serverCwd,
			env: {
				...process.env,
				BUTTER_ANALYZER: analyzerPath,
			},
		},
		transport: TransportKind.stdio,
	};

	const clientOptions = {
		documentSelector: [{ scheme: 'file', language: 'butter' }],
		initializationOptions: {
			analyzerPath,
		},
	};

	client = new LanguageClient(
		'butter-language-server',
		'Butter Language Server',
		serverOptions,
		clientOptions,
	);

	context.subscriptions.push(client.start());

	context.subscriptions.push(vscode.commands.registerCommand('butter.restartLanguageServer', async () => {
		if (!client) return;
		await client.stop();
		client.start();
	}));
}

async function deactivate() {
	if (!client) return;
	await client.stop();
	client = null;
}

function defaultAnalyzerPath(extensionRoot) {
	const candidate = path.join(extensionRoot, '..', 'butter', 'zig-out', 'bin', 'butter-analyzer');
	if (fs.existsSync(candidate)) {
		return candidate;
	}
	return 'butter-analyzer';
}

module.exports = {
	activate,
	deactivate,
};
