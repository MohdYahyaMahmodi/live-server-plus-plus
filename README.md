# Live Server++ 🚀

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/mohdmahmodi.live-server-plus-plus?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/mohdmahmodi.live-server-plus-plus?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/mohdmahmodi.live-server-plus-plus?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![License](https://img.shields.io/github/license/MohdYahyaMahmodi/live-server-plus-plus?style=for-the-badge)](LICENSE)

> A blazingly fast live development server with **real-time reload as you type** - no need to save!

Live Server++ is an enhanced development server for VS Code that brings your code to life instantly. Unlike traditional live servers, it reloads your browser **as you type**, giving you immediate visual feedback without pressing save.

---

## ✨ Features

### 🔥 **Live Reload as You Type**

Watch your changes appear in the browser **instantly** - no need to save files! Perfect for rapid prototyping and design tweaking.

### 🎨 **CSS Hot Reload**

CSS changes update without full page refresh, preserving your application state. No more losing form data or navigation position!

### 📊 **Browser Console Integration**

See browser console logs, warnings, and errors directly in VS Code's output panel. Debug without switching windows.

### ⚡ **Smart Caching**

Serves unsaved file changes from memory for lightning-fast updates while you're actively editing.

### 🌐 **CORS Enabled**

Built-in CORS support makes API testing seamless during development.

### 🎯 **Auto Port Detection**

Automatically finds available ports starting from 3000, incrementing if busy (3001, 3002, etc.).

### 🔒 **Secure by Default**

Directory traversal protection and security headers keep your development environment safe.

### 📁 **Directory Browsing**

Beautiful directory listings when no index.html is present, making navigation easy.

---

## 🚀 Quick Start

### Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type: `ext install mohdmahmodi.live-server-plus-plus`
4. Press Enter

Or search for **"Live Server++"** in the Extensions marketplace.

### Usage

**Method 1: Right-Click**

- Right-click any HTML file in Explorer or editor
- Select **"Open with Live Server++"**

**Method 2: Command Palette**

- Press `Ctrl+Shift+P` / `Cmd+Shift+P`
- Type: **"Live Server++: Open with Live Server++"**
- Press Enter

**Method 3: Status Bar**

- Click the **"🗼 Live Server++: 3000"** item in the status bar to stop

---

## ⚙️ Configuration

Open VS Code settings (`Ctrl+,` / `Cmd+,`) and search for **"Live Server++"**:

| Setting                              | Default   | Description                                              |
| ------------------------------------ | --------- | -------------------------------------------------------- |
| `liveServerPlusPlus.port`            | `3000`    | Default port for the server                              |
| `liveServerPlusPlus.browser`         | `default` | Browser to open (`default`, `chrome`, `firefox`, `edge`) |
| `liveServerPlusPlus.autoReloadDelay` | `100`     | Debounce delay in milliseconds for auto-reload           |
| `liveServerPlusPlus.enableCORS`      | `true`    | Enable CORS headers for API testing                      |
| `liveServerPlusPlus.showConsoleLog`  | `true`    | Show browser console logs in VS Code                     |
| `liveServerPlusPlus.verboseLogging`  | `false`   | Show detailed internal logging                           |

### Example Configuration

```json
{
  "liveServerPlusPlus.port": 5500,
  "liveServerPlusPlus.autoReloadDelay": 200,
  "liveServerPlusPlus.browser": "chrome",
  "liveServerPlusPlus.showConsoleLog": true
}
```

---

## 📖 How It Works

Live Server++ uses a combination of technologies to deliver instant feedback:

1. **File System Monitoring**: Watches workspace files for changes
2. **In-Memory Caching**: Caches open documents in memory for instant serving
3. **WebSocket Communication**: Maintains real-time connection with browser
4. **Smart Debouncing**: Prevents reload spam while typing (configurable delay)

### Live Reload Flow

```
You type → Document cached → Debounced trigger → WebSocket message → Browser reloads
```

### CSS Hot Reload Flow

```
CSS change → WebSocket message → Stylesheet timestamp update → Instant visual update
```

---

## 🎯 Use Cases

- **Rapid Prototyping**: See design changes instantly
- **Learning Web Development**: Immediate feedback while learning HTML/CSS/JS
- **Design Fine-Tuning**: Tweak layouts and styles in real-time
- **Client Presentations**: Make live adjustments during demos
- **Teaching**: Show code changes to students in real-time

---

## 🆚 Comparison

| Feature                    | Live Server++ | Traditional Live Server |
| -------------------------- | ------------- | ----------------------- |
| Reload as you type         | ✅            | ❌ (requires save)      |
| CSS Hot Reload             | ✅            | ❌                      |
| Browser Console in VS Code | ✅            | ❌                      |
| In-Memory Caching          | ✅            | ❌                      |
| Auto Port Detection        | ✅            | ✅                      |
| CORS Support               | ✅            | ⚠️ (varies)             |

---

## 🐛 Known Limitations

- **File Size**: Files over 50MB are not cached (served from disk)
- **Cache Limit**: Maximum 100MB total cache, 50 files
- **Single Workspace**: Works with one workspace at a time
- **Static Files Only**: Not suitable for server-side rendering or databases

For dynamic backends, use Node.js/Express instead.

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/MohdYahyaMahmodi/live-server-plus-plus.git
cd live-server-plus-plus

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Open in VS Code
code .

# Press F5 to run in debug mode
```

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

## 📄 License

[MIT License](LICENSE) © 2025 Mohd Mahmodi

---

## 🙏 Acknowledgments

- Inspired by the original [Live Server](https://github.com/ritwickdey/vscode-live-server) by Ritwick Dey
- Built with ❤️ for the web development community

---

## 🔗 Links

- [GitHub Repository](https://github.com/MohdYahyaMahmodi/live-server-plus-plus)
- [Issue Tracker](https://github.com/MohdYahyaMahmodi/live-server-plus-plus/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MohdYahyaMahmodi.live-server-plus-plus)

---

## 💡 Tips & Tricks

**Adjust Reload Delay**

```json
"liveServerPlusPlus.autoReloadDelay": 200
```

Increase for slower typing, decrease for faster feedback.

**View Browser Console**
Enable console logging and open the Output panel (`Ctrl+Shift+U`) → Select "Live Server++" from dropdown.

**Disable Verbose Logging**
Keep it off for cleaner output:

```json
"liveServerPlusPlus.verboseLogging": false
```

---

**Made with 💜 by [Mohd Mahmodi](https://github.com/MohdYahyaMahmodi)**

If you find this extension helpful, please ⭐ star the repo and leave a review!
