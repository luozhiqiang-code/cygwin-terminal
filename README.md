# VS Code Cygwin 终端

一个 VS Code 扩展，允许你直接从资源管理器上下文菜单打开 Cygwin 终端，并自动导航到所选目录或文件所在的目录。

## 功能特点

- 在资源管理器上下文菜单中添加"用 Cygwin 打开"选项
- 支持文件夹和文件（对于文件会在其所在目录中打开）
- 自动将 Windows 路径转换为 Cygwin 路径
- 在选定位置打开 Cygwin 终端
- 支持所有 Windows 驱动器（C:, D: 等）的正确路径映射
- 使用 mintty 终端模拟器（Cygwin 自带）
- 正确处理路径中的空格和特殊字符

![用 Cygwin 打开](images/open-with-cygwin.png)

## 使用方法

1. 在 VS Code 的资源管理器中右键点击任意文件夹或文件
2. 从上下文菜单中选择"用 Cygwin 打开"
3. Cygwin 终端将会打开：
   - 对于文件夹：终端会在选定目录中打开
   - 对于文件：终端会在文件的父目录中打开

### 路径转换示例：
- `C:\Users\Administrator` → `/cygdrive/c/Users/Administrator`
- `D:\workspace\project` → `/cygdrive/d/workspace/project`
- `C:\Program Files\App` → `/cygdrive/c/Program\ Files/App`

## 系统要求

- 系统中必须安装 Cygwin（默认路径：C:\cygwin64）
- 必须安装 mintty 终端模拟器（Cygwin 自带）

## 扩展设置

本扩展提供以下设置选项：

* `cygwinTerminal.path`：Cygwin bash 可执行文件的路径（默认值：`"C:\\cygwin64\\bin\\bash.exe"`）

## 详细功能

### 终端模拟器
- 使用 mintty 终端模拟器（Cygwin 自带）
- 支持完整的终端功能和 Unicode 字符
- 提供良好的终端体验和兼容性

### 路径处理
- 强大的 Windows 到 Cygwin 格式的路径转换
- 特殊字符转义处理
- 正确处理空格和引号
- 支持网络驱动器和 UNC 路径

### 进程管理
- 使用分离进程模式确保终端独立性
- 正确处理环境变量
- 清理进程终止

## 已知问题

- 必须安装 mintty（Cygwin 默认已安装）

## 版本说明

### 1.0.0

Cygwin 终端扩展的初始版本：
- 为文件和文件夹添加"用 Cygwin 打开"上下文菜单选项
- 实现 Windows 到 Cygwin 的路径转换，支持特殊字符
- 添加自动目录导航功能
- 使用 mintty 终端模拟器
- 添加强大的路径处理和错误管理

---

## 参与贡献

欢迎在我们的 GitHub 仓库提交问题和改进建议。

## 许可证

[MIT](LICENSE)

## 更多信息

* [Visual Studio Code 扩展指南](https://code.visualstudio.com/api/references/extension-guidelines)
* [Cygwin 文档](https://cygwin.com/docs.html)

## 开发指南

### 开发环境要求

- Node.js (推荐 v16.x 或更高版本)
- Visual Studio Code
- Git
- TypeScript
- Cygwin (用于测试)

### 项目设置

1. 克隆仓库：
```bash
git clone https://github.com/your-username/cygwin-terminal.git
cd cygwin-terminal
```

2. 安装依赖：
```bash
npm install
```

### 构建和运行

项目提供了以下 npm 脚本：

- `npm run watch` - 启动开发模式，自动编译和监视文件变化
- `npm run compile` - 编译 TypeScript 代码
- `npm run lint` - 运行代码检查
- `npm run test` - 运行测试用例

### 调试扩展

1. 在 VS Code 中打开项目
2. 按 F5 启动调试会话（这将打开一个新的 VS Code 窗口）
3. 在新窗口中测试扩展功能
4. 使用 VS Code 的调试控制台查看日志输出
5. 断点和调试功能都可以正常使用

### 开发任务

项目使用 VS Code 任务系统进行构建：

- `watch` - 同时运行 TypeScript 和 esbuild 的监视任务
- `watch:tsc` - 监视 TypeScript 文件变化
- `watch:esbuild` - 监视并构建项目文件

可以在 VS Code 命令面板中运行这些任务（Ctrl+Shift+P，然后输入 "Tasks: Run Task"）

### 调试日志

扩展在运行时会输出详细的调试日志：

1. 在 VS Code 中打开输出面板（Ctrl+Shift+U）
2. 从下拉菜单中选择 "Cygwin Terminal"
3. 所有操作的日志都会显示在这里

### 常见问题解决

1. 如果遇到 TypeScript 编译错误：
   - 确保已安装所有依赖 `npm install`
   - 检查 TypeScript 版本是否匹配

2. 如果调试窗口无法启动：
   - 检查是否有其他调试会话在运行
   - 尝试清理并重新构建项目：
     ```bash
     npm run clean
     npm install
     npm run compile
     ```

3. 如果扩展无法加载：
   - 检查输出面板中的错误信息
   - 验证 package.json 中的配置是否正确

### 提交代码

1. 创建新的分支进行开发
2. 确保代码通过所有测试和 lint 检查
3. 提交代码时使用清晰的提交信息
4. 创建 Pull Request 时提供详细的描述

**祝您使用愉快！**
