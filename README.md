# Cygwin Terminal for VS Code

A VS Code extension that allows you to open Cygwin terminal directly from the Explorer context menu, automatically navigating to the selected directory.

## Features

- Adds "Open with Cygwin" option to the Explorer context menu
- Automatically converts Windows paths to Cygwin paths
- Opens Cygwin terminal in the selected directory
- Supports all Windows drives (C:, D:, etc.) with proper Cygwin path mapping

![Open with Cygwin](images/open-with-cygwin.png)

## Usage

1. Right-click on any folder in VS Code's Explorer
2. Select "Open with Cygwin" from the context menu
3. A Cygwin terminal will open and automatically `cd` into the selected directory

### Path Conversion Examples:
- `C:\Users\Administrator` → `/cygdrive/c/Users/Administrator`
- `D:\workspace\project` → `/cygdrive/d/workspace/project`

## Requirements

- Cygwin must be installed on your system
- Cygwin's `bin` directory should be in your system's PATH

## Extension Settings

This extension contributes the following settings:

* `cygwinTerminal.path`: Path to Cygwin installation (default: "C:\\cygwin64\\bin\\bash.exe")
* `cygwinTerminal.args`: Additional arguments for Cygwin terminal (default: ["--login", "-i"])

## Known Issues

- None reported yet

## Release Notes

### 1.0.0

Initial release of Cygwin Terminal extension:
- Added "Open with Cygwin" context menu option
- Implemented Windows to Cygwin path conversion
- Added automatic directory navigation

---

## Contributing

Feel free to submit issues and enhancement requests on our GitHub repository.

## License

[MIT](LICENSE)

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
