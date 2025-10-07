# Changelog

All notable changes to the "Live Server++" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-06

### 🎉 Initial Release

#### Added

- ⚡ Auto-reload as you type (no need to save!)
- 🔥 CSS hot reload without page refresh
- 📊 Browser console forwarding to VS Code
- 🌐 CORS support enabled by default
- 🎯 Right-click context menu integration
- 📁 Beautiful directory browsing
- 🔒 Security: directory traversal protection
- 🎨 Customizable auto-reload delay
- 🚀 Automatic port detection (3000+)
- 📝 Verbose logging option for debugging
- 💎 Serves unsaved file changes in real-time
- 🎭 Beautiful error pages with suggestions
- 🔧 Configurable browser selection

#### Features

- Real-time WebSocket-based live reload
- In-memory document caching for unsaved changes
- Support for HTML, CSS, JS, JSON files
- Image and asset file watching
- Status bar indicator with port display
- Multiple MIME type support
- Clean, minimal logging (non-verbose mode)

#### Security

- Directory traversal protection
- Path normalization
- Safe file serving

---

## [Unreleased]

### Planned

- Node.js server.js support
- HTTPS support
- Custom middleware
- Proxy configuration
- Multi-root workspace support
