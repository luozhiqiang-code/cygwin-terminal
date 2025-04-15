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

	let disposable = vscode.commands.registerCommand('cygwin-terminal.openTerminal', async (uri: vscode.Uri) => {
		// 获取配置
		const config = vscode.workspace.getConfiguration('cygwinTerminal');
		const cygwinPath = config.get<string>('path') || 'C:\\cygwin64\\bin\\bash.exe';
		
		console.log('Debug: Cygwin path:', cygwinPath);
		
		try {
			// 检查 Cygwin 是否存在
			if (!fs.existsSync(cygwinPath)) {
				throw new Error(`Cygwin executable not found at: ${cygwinPath}`);
			}

			// 获取 Cygwin 根目录和 mintty 路径
			const cygwinRoot = path.dirname(path.dirname(cygwinPath));
			const minttyPath = path.join(cygwinRoot, 'bin', 'mintty.exe');
			console.log('Debug: Checking for mintty at:', minttyPath);

			// 获取选中的目录路径并转换
			const selectedPath = uri.fsPath;
			console.log('Debug: Selected path:', selectedPath);
			
			// 检查路径是否存在
			if (!fs.existsSync(selectedPath)) {
				throw new Error(`Selected path does not exist: ${selectedPath}`);
			}
			
			// 如果选中的是文件，使用其所在目录
			const folderPath = fs.statSync(selectedPath).isDirectory() ? 
				selectedPath : 
				path.dirname(selectedPath);
			console.log('Debug: Target folder path:', folderPath);
			
			// 转换为 Cygwin 路径
			const cygwinFolderPath = convertToCygwinPath(folderPath);
			console.log('Debug: Converted Cygwin path:', cygwinFolderPath);
			
			// 基本环境变量配置
			const baseEnv = {
				...process.env,
				CHERE_INVOKING: "1",
				CYGWIN: "nodosfilewarning",
				CYGWIN_ROOT: cygwinRoot
			};
			
			let terminal;
			
			if (fs.existsSync(minttyPath)) {
				// 使用 mintty
				console.log('Debug: Using mintty');
				const minttyArgs = [
					'-i', '/Cygwin-Terminal.ico',
					'--dir', cygwinFolderPath,
					'-'
				];
				
				console.log('Debug: Mintty command args:', minttyArgs);
				
				terminal = spawn(minttyPath, minttyArgs, {
					detached: true,
					stdio: ['ignore', 'ignore', 'ignore'],
					windowsHide: false,
					shell: false,
					cwd: path.join(cygwinRoot, 'bin'),
					env: baseEnv
				});

				if (!terminal) {
					throw new Error('Terminal process creation failed');
				}
				
				console.log('Debug: Terminal spawn successful');
				
				if (!terminal.pid) {
					throw new Error('Terminal process started but no PID assigned');
				}
				
				console.log('Debug: Terminal process started with PID:', terminal.pid);
				
				// 处理错误
				terminal.on('error', (err: Error) => {
					console.error('Debug: Terminal error:', err);
					console.error('Debug: Error stack:', err.stack);
					vscode.window.showErrorMessage(`Failed to open Cygwin terminal: ${err.message}`);
				});
				
				// 处理进程退出
				terminal.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
					console.log('Debug: Terminal process exited with code:', code);
					console.log('Debug: Terminal process exit signal:', signal);
					if (code !== 0) {
						vscode.window.showErrorMessage(`Cygwin terminal process exited with code: ${code}, signal: ${signal}`);
					}
				});
				
				// 分离进程
				terminal.unref();
				console.log('Debug: Terminal process detached');
			} else {
				throw new Error('Mintty not found. Please make sure Cygwin is properly installed.');
			}
			
		} catch (error) {
			console.error('Debug: Caught error:', error);
			vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


