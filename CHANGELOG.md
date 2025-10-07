# Changelog

All notable changes to the "Live Server++" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-10-06

### 🎉 Initial Release

**Live Server++** brings real-time development to VS Code with instant reload as you type!

### ✨ Added

#### Core Features

- **Live Reload as You Type**: Browser updates automatically while typing, no need to save files
- **CSS Hot Reload**: CSS changes update instantly without full page refresh
- **Browser Console Integration**: Console logs, warnings, and errors appear in VS Code Output panel
- **In-Memory Caching**: Serves unsaved changes from memory for lightning-fast updates
- **Auto Port Detection**: Automatically finds available ports (3000, 3001, 3002, etc.)

#### Server Features

- HTTP server with WebSocket support for real-time communication
- CORS enabled by default for seamless API testing
- Directory traversal protection for security
- Beautiful directory listings when no index.html present
- Support for all common file types (HTML, CSS, JS, images, fonts, media)
- Custom error pages (404, 403, 500) with helpful suggestions

#### Configuration Options

- `liveServerPlusPlus.port`: Configure default server port (default: 3000)
- `liveServerPlusPlus.browser`: Choose browser to open (default, chrome, firefox, edge)
- `liveServerPlusPlus.autoReloadDelay`: Adjust debounce delay (default: 100ms)
- `liveServerPlusPlus.enableCORS`: Toggle CORS headers (default: true)
- `liveServerPlusPlus.showConsoleLog`: Show/hide browser console in VS Code (default: true)
- `liveServerPlusPlus.verboseLogging`: Enable detailed internal logging (default: false)

#### Developer Experience

- Status bar indicator showing server status and port
- Right-click context menu for HTML files
- Command palette integration
- Clean, filterable output logs
- Smart file watching for HTML, CSS, JS, JSON, and image files

### 🔒 Security

- Directory traversal attack prevention
- Normalized path validation
- Secure default headers
- File size limits (50MB per file, 100MB cache)

### 📊 Performance

- Debounced file watching prevents reload spam
- In-memory document caching for active files
- Automatic cache cleanup when files are closed
- Optimized WebSocket communication

### 🎨 UI/UX

- Modern gradient error pages
- Emoji-enhanced status messages
- Helpful 404 pages with file suggestions
- Organized directory browser with icons
- Color-coded console output

---

## [Unreleased]

### Planned Features

- Node.js server support for dynamic backends
- Custom middleware support
- Proxy configuration for API calls
- HTTPS/SSL support
- Multi-root workspace support
- Live Sass/LESS compilation
- Browser sync across multiple devices
- Custom ignore patterns

---

## Version History

### Version Numbering

- **Major** (1.x.x): Breaking changes or major new features
- **Minor** (x.1.x): New features, backward compatible
- **Patch** (x.x.1): Bug fixes, backward compatible

---

## Contributing

Found a bug or have a feature request? Please check our [Contributing Guide](CONTRIBUTING.md) and [open an issue](https://github.com/MohdYahyaMahmodi/live-server-plus-plus/issues)!
