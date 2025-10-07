# Live Server++ 🔥

> A modern live development server with real-time auto-reload, CSS hot reloading, and browser console forwarding built right into VS Code.

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/yourusername/live-server-plus-plus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🚀 **Auto-Reload as You Type**

No need to save! See your changes in the browser **instantly as you type**. Perfect for rapid prototyping and iterative design.

### 🔥 **CSS Hot Reload**

CSS changes reload **without refreshing the page** - preserving form inputs, scroll position, and application state.

### 📊 **Browser Console → VS Code**

View all `console.log()`, `console.error()`, and other browser console output directly in VS Code's Output panel.

### 🌐 **CORS Enabled**

Test your API calls without CORS issues. Perfect for frontend development with separate backend servers.

### ⚡ **Smart Features**

- Auto port detection (starts at 3000, increments if busy)
- Serves unsaved file changes in real-time
- Directory browsing with beautiful UI
- Security: directory traversal protection
- Beautiful error pages with helpful suggestions

## 🎬 Demo

![Demo GIF](https://via.placeholder.com/800x450.png?text=Add+Your+Demo+GIF+Here)

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type: `ext install mohdmahmodi.live-server-plus-plus`
4. Press Enter

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/yourusername/live-server-plus-plus/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
4. Type: `Extensions: Install from VSIX`
5. Select the downloaded file

## 🚀 Quick Start

### Method 1: Right-Click

1. Right-click on any `.html` file in Explorer
2. Select **"Open with Live Server++"**
3. Browser opens automatically! 🎉

### Method 2: Command Palette

1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type: `Live Server++: Open with Live Server++`
3. Press Enter

### Method 3: Editor Context

1. Open an HTML file
2. Right-click anywhere in the editor
3. Select **"Open with Live Server++"**

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "Live Server++"

| Setting                              | Default   | Description                                              |
| ------------------------------------ | --------- | -------------------------------------------------------- |
| `liveServerPlusPlus.port`            | `3000`    | Default server port                                      |
| `liveServerPlusPlus.browser`         | `default` | Browser to open (`default`, `chrome`, `firefox`, `edge`) |
| `liveServerPlusPlus.autoReloadDelay` | `100`     | Delay in ms before auto-reload triggers                  |
| `liveServerPlusPlus.enableCORS`      | `true`    | Enable CORS headers                                      |
| `liveServerPlusPlus.showConsoleLog`  | `true`    | Show browser console in VS Code                          |
| `liveServerPlusPlus.verboseLogging`  | `false`   | Show detailed debug logs                                 |

### Example Configuration

```json
{
  "liveServerPlusPlus.port": 3000,
  "liveServerPlusPlus.autoReloadDelay": 100,
  "liveServerPlusPlus.browser": "chrome",
  "liveServerPlusPlus.enableCORS": true
}
```

## 📖 Usage
