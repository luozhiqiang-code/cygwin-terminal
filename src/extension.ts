// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('========================================');
	console.log('Cygwin Terminal Extension is activating!');
	console.log('========================================');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cygwin-terminal" is now active!');
	console.log('Debug: Registering command cygwin-terminal.openTerminal');

	vscode.window.showInformationMessage('Cygwin Terminal Extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// 将 Windows 路径转换为 Cygwin 路径
	function convertToCygwinPath(windowsPath: string): string {
		// 确保路径使用正斜杠并规范化
		const normalizedPath = windowsPath.replace(/\\/g, '/');
		
		// 提取盘符并转换为小写
		const match = normalizedPath.match(/^([A-Za-z]):/);
		if (!match) {
			return normalizedPath;
		}
		
		const drive = match[1].toLowerCase();
		const remainingPath = normalizedPath.substring(2)
			.replace(/^\/+|\/+$/g, '')  // 移除开头和结尾的多余斜杠
			.replace(/\/+/g, '/')  // 将多个连续的斜杠替换为单个斜杠
			.replace(/[\s'"]/g, '\\$&');  // 转义空格和引号
		
		return `/cygdrive/${drive}/${remainingPath}`;
	}

	// 创建集成终端
	async function createIntegratedTerminal(cygwinPath: string, folderPath: string) {
		const terminal = vscode.window.createTerminal({
			name: 'Cygwin',
			shellPath: cygwinPath,
			shellArgs: ['--login', '-i'],
			cwd: folderPath,
			env: {
				CHERE_INVOKING: "1",
				CYGWIN: "nodosfilewarning"
			}
		});
		terminal.show();
		return terminal;
	}

	// 创建外部终端
	async function createOuterTerminal(uri: vscode.Uri, config: vscode.WorkspaceConfiguration) {
		const cygwinPath = config.get<string>('path') || 'C:\\cygwin64\\bin\\bash.exe';
		const cygwinRoot = path.dirname(path.dirname(cygwinPath));
		const minttyPath = path.join(cygwinRoot, 'bin', 'mintty.exe');

		if (!fs.existsSync(minttyPath)) {
			throw new Error('Mintty not found. Please make sure Cygwin is properly installed.');
		}

		const selectedPath = uri.fsPath;
		const folderPath = fs.statSync(selectedPath).isDirectory() ? 
			selectedPath : 
			path.dirname(selectedPath);
		
		const cygwinFolderPath = convertToCygwinPath(folderPath);
		
		const baseEnv = {
			...process.env,
			CHERE_INVOKING: "1",
			CYGWIN: "nodosfilewarning",
			CYGWIN_ROOT: cygwinRoot
		};

		const minttyArgs = [
			'-i', '/Cygwin-Terminal.ico',
			'--dir', cygwinFolderPath,
			'-'
		];

		const terminal = spawn(minttyPath, minttyArgs, {
			detached: true,
			stdio: ['ignore', 'ignore', 'ignore'],
			windowsHide: false,
			shell: false,
			cwd: path.join(cygwinRoot, 'bin'),
			env: baseEnv
		});

		terminal.on('error', (err: Error) => {
			console.error('Debug: Terminal error:', err);
			vscode.window.showErrorMessage(`Failed to open Cygwin terminal: ${err.message}`);
		});

		terminal.unref();
	}

	// 注册集成终端命令
	let integratedTerminalDisposable = vscode.commands.registerCommand('cygwin-terminal.openIntegratedTerminal', async (uri: vscode.Uri) => {
		try {
			const config = vscode.workspace.getConfiguration('cygwinTerminal');
			const cygwinPath = config.get<string>('path') || 'C:\\cygwin64\\bin\\bash.exe';

			if (!fs.existsSync(cygwinPath)) {
				throw new Error(`Cygwin executable not found at: ${cygwinPath}`);
			}

			const selectedPath = uri.fsPath;
			if (!fs.existsSync(selectedPath)) {
				throw new Error(`Selected path does not exist: ${selectedPath}`);
			}

			const folderPath = fs.statSync(selectedPath).isDirectory() ? 
				selectedPath : 
				path.dirname(selectedPath);

			await createIntegratedTerminal(cygwinPath, folderPath);
		} catch (error) {
			console.error('Debug: Caught error:', error);
			vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
		}
	});

	// 注册外部终端命令
	let outerTerminalDisposable = vscode.commands.registerCommand('cygwin-terminal.openOuterTerminal', async (uri: vscode.Uri) => {
		try {
			const config = vscode.workspace.getConfiguration('cygwinTerminal');
			await createOuterTerminal(uri, config);
		} catch (error) {
			console.error('Debug: Caught error:', error);
			vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
		}
	});

	context.subscriptions.push(integratedTerminalDisposable);
	context.subscriptions.push(outerTerminalDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


