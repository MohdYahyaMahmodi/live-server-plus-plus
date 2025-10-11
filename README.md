# Live Server++ (Version 1.1.0)

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/mohdmahmodi.live-server-plus-plus?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/mohdmahmodi.live-server-plus-plus?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/mohdmahmodi.live-server-plus-plus?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)
[![License](https://img.shields.io/github/license/MohdYahyaMahmodi/live-server-plus-plus?style=for-the-badge)](LICENSE)

A powerful live development server for VS Code with real-time reload as you type. Unlike traditional live servers that require saving files, **Live Server++** updates your browser instantly as you edit, providing immediate visual feedback.

---

## 🚀 Features

### ⚡ Live Reload as You Type

Changes appear in your browser immediately without saving files. Perfect for rapid prototyping and iterative design work.

### 🎨 CSS Hot Reload

CSS modifications update instantly without full page refresh, preserving application state and scroll position.

### 🧰 Dedicated Control Panel

A clean sidebar panel provides full control over the server with:

- Real-time server status and port information
- File picker to choose which HTML file to serve
- List of active files with one-click access
- Quick actions for starting, stopping, and managing files

### 🐛 Browser Console Integration

Console logs, warnings, and errors from your browser appear directly in VS Code's output panel, eliminating the need to switch windows during debugging.

### 🧠 In-Memory Caching

Unsaved changes are served directly from memory, ensuring the fastest possible reload times during active development.

### 🌐 CORS Support

Built-in CORS headers enable seamless API testing during local development.

### 🔍 Smart Port Detection

Automatically finds available ports starting from 3000. If a port is in use, the server will try the next available port.

### 🔒 Security Features

- Directory traversal protection
- Path normalization and validation
- Secure default headers
- Request sanitization

### ⚠️ Professional Error Pages

Clean, minimalist error pages with helpful information when files are not found or other issues occur.

---

## 📦 Installation

1. Open VS Code
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Type: `ext install mohdmahmodi.live-server-plus-plus`
4. Press Enter

Alternatively, search for **"Live Server++"** in the Extensions marketplace.

---

## 🧪 Usage

### ▶️ Starting the Server

**Method 1: Sidebar Panel**

1. Click the **Live Server++** icon in the Activity Bar
2. Click **Start Server**
3. Select an HTML file from the picker

**Method 2: Right-Click Menu**

- Right-click any HTML file in the Explorer or editor
- Select **"Open with Live Server++"**

**Method 3: Status Bar**

- Click **"Open with Live Server++"** in the status bar
- When a server is running, click **"Close Live Server++"** to stop

**Method 4: Command Palette**

- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type **"Live Server++: Start"** and press Enter

### 📂 Managing Active Files

The sidebar panel displays all files you've opened with the server. Click any file to reopen it in your browser, or use the close button to remove it from the list.

### 🛑 Stopping the Server

- Click **"Close Live Server++"** in the status bar
- Click **"Stop Server"** in the sidebar panel
- Use the Command Palette: **"Live Server++: Stop"**

---

## ⚙️ Configuration

Access settings via `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac), then search for **"Live Server++"**.

| Setting                              | Default   | Description                                      |
| ------------------------------------ | --------- | ------------------------------------------------ |
| `liveServerPlusPlus.port`            | `3000`    | Default server port                              |
| `liveServerPlusPlus.browser`         | `default` | Browser to open (default, chrome, firefox, edge) |
| `liveServerPlusPlus.autoReloadDelay` | `100`     | Debounce delay in milliseconds for auto-reload   |
| `liveServerPlusPlus.enableCORS`      | `true`    | Enable CORS headers for API testing              |
| `liveServerPlusPlus.showConsoleLog`  | `true`    | Show browser console logs in VS Code output      |
| `liveServerPlusPlus.verboseLogging`  | `false`   | Enable detailed internal logging                 |

### 🧪 Example Configuration

```json
{
  "liveServerPlusPlus.port": 5500,
  "liveServerPlusPlus.autoReloadDelay": 200,
  "liveServerPlusPlus.browser": "chrome",
  "liveServerPlusPlus.showConsoleLog": true
}
```

---

## 🧠 How It Works

**Live Server++** monitors your workspace for file changes and maintains a WebSocket connection with the browser. When you type, changes are cached in memory and the browser is notified to reload. CSS changes trigger a targeted stylesheet update without a full page refresh.

**Architecture:**

```
Editor Changes → In-Memory Cache → WebSocket Signal → Browser Update
```

For CSS files:

```
CSS Edit → Cache Update → WebSocket → Stylesheet Refresh (no reload)
```

---

## 💡 Use Cases

- **Web Development:** Instant feedback while building interfaces
- **Design Work:** Real-time visual adjustments to layouts and styles
- **Learning:** Immediate results when learning HTML, CSS, and JavaScript
- **Prototyping:** Rapid iteration on design concepts
- **Teaching:** Live demonstrations of code changes to students
- **Client Reviews:** Make adjustments during live presentations

---

## 📊 Comparison with Other Tools

| Feature                   | Live Server++ | Traditional Live Server |
| ------------------------- | ------------- | ----------------------- |
| Reload without saving     | ✅ Yes        | ❌ No                   |
| CSS hot reload            | ✅ Yes        | ❌ No                   |
| Browser console in editor | ✅ Yes        | ❌ No                   |
| In-memory caching         | ✅ Yes        | ❌ No                   |
| Dedicated control panel   | ✅ Yes        | ❌ No                   |
| File picker               | ✅ Yes        | ❌ No                   |
| Active files management   | ✅ Yes        | ❌ No                   |

---

## ⚠️ Known Limitations

- Files larger than **50MB** are served from disk rather than cached
- Maximum cache size is **100MB across 50 files**
- Designed for **single workspace** use
- Best suited for **static HTML/CSS/JS** development
- Not a replacement for backend servers with databases or SSR

> For applications requiring backend processing, consider using **Node.js with Express** or similar frameworks.

---

## 🤝 Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` before submitting pull requests.

### Development Setup

```bash
git clone https://github.com/MohdYahyaMahmodi/live-server-plus-plus.git
cd live-server-plus-plus
npm install
npm run compile
code .
```

Press `F5` in VS Code to launch the extension in debug mode.

---

## 🪵 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

---

## 📜 License

MIT License - Copyright © 2025 Mohd Mahmodi

---

## 🙌 Acknowledgments

Inspired by the original Live Server extension by **Ritwick Dey**. Built to provide an enhanced development experience with modern features and improved performance.

---

## 🔗 Links

- [GitHub Repository](https://github.com/MohdYahyaMahmodi/live-server-plus-plus)
- [Issue Tracker](https://github.com/MohdYahyaMahmodi/live-server-plus-plus/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mohdmahmodi.live-server-plus-plus)

---

## 💡 Tips

### ⚙️ Adjust Reload Speed

Increase the delay if you type slowly, decrease for faster feedback:

```json
"liveServerPlusPlus.autoReloadDelay": 200
```

### 🪶 View Browser Console

Enable console logging and open the **Output panel** (`Ctrl+Shift+U`), then select **"Live Server++"** from the dropdown.

### 📉 Reduce Log Verbosity

Keep verbose logging disabled for cleaner output:

```json
"liveServerPlusPlus.verboseLogging": false
```

---

## 👤 Created by Mohd Mahmodi

If this extension is helpful, please ⭐ star the repository and leave a review on the VS Code Marketplace!
