# Changelog

All notable changes to the "Live Server++" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-10-11

### Major Update: Control Panel and Enhanced UX

This release introduces a dedicated sidebar panel for better server management and significantly improves the user experience when working with multiple files.

### Added

#### Sidebar Control Panel

- **Dedicated Activity Bar Icon**: Live Server++ now has its own icon in the Activity Bar for easy access
- **Server Status Section**: Real-time display of server state (running/stopped), port number, and localhost URL
- **Quick Actions Section**: One-click buttons for common operations
  - Start Server (with file picker when stopped)
  - Open Current File (opens the active editor's HTML file)
  - Stop Server (when running)
- **Active Files Section**: Lists all files opened during the current server session
  - Click any file to reopen it in the browser
  - Inline close button (X) for each file to remove from list
  - File counter showing total active files
  - Clear All option when multiple files are open

#### File Picker

- **Smart HTML Detection**: Automatically finds all HTML files in the workspace
- **Search and Filter**: Quick pick interface with fuzzy search
- **File Path Display**: Shows relative paths to help identify files in large projects
- **No Index.html Required**: No longer defaults to index.html or shows 404 when starting server

#### Improved Status Bar

- **Context-Aware Text**: Changes based on current state and active file
  - When stopped and HTML file active: "Open with Live Server++"
  - When stopped and no HTML file: Opens file picker
  - When running: "Close Live Server++"
- **Enhanced Tooltips**: More informative hover text with server details
- **Smart Command Binding**: Status bar action adapts to current context

### Changed

#### User Experience

- **Starting Server**: Now prompts for file selection instead of defaulting to index.html
- **Opening Additional Files**: Server stays running when opening new files instead of showing "already running" error
- **Error Handling**: Better messages when no HTML files exist in workspace
- **File Management**: Active files list persists during server session and clears on stop

#### Visual Design

- **Minimalist 404 Page**: Redesigned with clean black background, white text, and mobile-responsive layout
- **Section Headers**: Control panel uses clear section labels with appropriate icons
- **Status Indicators**: Color-coded icons (green for running, red for stopped)
- **Professional Styling**: Removed gradients and excessive visual effects for cleaner appearance

#### Technical Improvements

- **URL Construction**: Always uses localhost instead of 127.0.0.1 for better readability
- **Path Handling**: Improved relative path calculation from workspace root
- **State Management**: Better tracking of opened files and server state
- **Command Registration**: New commands for enhanced functionality

### Fixed

- Server no longer shows 404 when no index.html exists
- Status bar command now correctly opens current file when HTML is active
- Multiple files can be opened without restarting server
- Active files list properly syncs with server state
- Close buttons appear correctly for each file item

### Technical Details

#### New Commands

- `liveServerPlusPlus.startWithPicker`: Start server with file selection dialog
- `liveServerPlusPlus.openCurrent`: Open currently active HTML file
- `liveServerPlusPlus.removeFile`: Remove specific file from active list
- `liveServerPlusPlus.openUrl`: Open URL from tree view item

#### Architecture Changes

- New `treeview.ts` module for sidebar panel implementation
- Enhanced state management in extension.ts
- Improved separation of concerns between UI and server logic
- Better TypeScript type definitions for tree view items

---

## [1.0.0] - 2025-10-07

### Initial Release

Live Server++ brings real-time development to VS Code with instant reload as you type.

### Added

#### Core Features

- **Live Reload as You Type**: Browser updates automatically while typing, no need to save files
- **CSS Hot Reload**: CSS changes update instantly without full page refresh
- **Browser Console Integration**: Console logs, warnings, and errors appear in VS Code Output panel
- **In-Memory Caching**: Serves unsaved changes from memory for fast updates
- **Auto Port Detection**: Automatically finds available ports (3000, 3001, 3002, etc.)

#### Server Features

- HTTP server with WebSocket support for real-time communication
- CORS enabled by default for seamless API testing
- Directory traversal protection for security
- Directory listings when no index.html present
- Support for common file types (HTML, CSS, JS, images, fonts, media)
- Custom error pages (404, 403, 500)

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

### Security

- Directory traversal attack prevention
- Normalized path validation
- Secure default headers
- File size limits (50MB per file, 100MB cache)

### Performance

- Debounced file watching prevents reload spam
- In-memory document caching for active files
- Automatic cache cleanup when files are closed
- Optimized WebSocket communication

---

## Version Numbering

- **Major** (1.x.x): Breaking changes or significant new features
- **Minor** (x.1.x): New features, backward compatible
- **Patch** (x.x.1): Bug fixes, backward compatible

---

## Contributing

Found a bug or have a feature request? Please check our [Contributing Guide](CONTRIBUTING.md) and [open an issue](https://github.com/MohdYahyaMahmodi/live-server-plus-plus/issues).
