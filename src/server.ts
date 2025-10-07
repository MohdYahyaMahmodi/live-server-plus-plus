import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { WebSocketServer, WebSocket } from "ws";
import { ServerConfig, ReloadMessage } from "./types";

export class LiveServer {
  private httpServer: http.Server | undefined = undefined;
  private wsServer: WebSocketServer | undefined = undefined;
  private port: number = 3000;
  private clients: Set<WebSocket> = new Set();
  private fileWatcher: vscode.Disposable | undefined = undefined;
  private rootPath: string = "";
  private workspacePath: string = "";
  private config: ServerConfig | undefined = undefined;
  private outputChannel: vscode.OutputChannel;

  // Cache for in-memory document content
  private documentCache: Map<string, string> = new Map();

  private readonly MIME_TYPES: { [key: string]: string } = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "font/otf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".xml": "application/xml",
    ".webmanifest": "application/manifest+json",
  };

  private readonly LIVE_RELOAD_SCRIPT = `
    <script>
      (function() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(protocol + '//' + window.location.host + '/__live_reload');
        
        // Store original console methods
        const originalConsole = {
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
          info: console.info.bind(console)
        };
        
        // Override console to send to server
        ['log', 'warn', 'error', 'info'].forEach(method => {
          console[method] = function(...args) {
            originalConsole[method](...args);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'console',
                method: method,
                args: args.map(arg => {
                  try {
                    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                  } catch (e) {
                    return String(arg);
                  }
                })
              }));
            }
          };
        });
        
        // Create error overlay
        function createErrorOverlay(message) {
          let overlay = document.getElementById('__live_server_error_overlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = '__live_server_error_overlay';
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: #ff4444;
              color: white;
              padding: 15px;
              font-family: monospace;
              font-size: 14px;
              z-index: 999999;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              border-bottom: 3px solid #cc0000;
            \`;
            document.body.appendChild(overlay);
          }
          overlay.innerHTML = \`
            <strong>⚠️ Error:</strong> \${message}
            <button onclick="this.parentElement.remove()" style="float: right; background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; cursor: pointer; border-radius: 3px;">✕</button>
          \`;
        }
        
        function removeErrorOverlay() {
          const overlay = document.getElementById('__live_server_error_overlay');
          if (overlay) overlay.remove();
        }
        
        // Hot reload CSS without page refresh
        function hotReloadCSS(cssFile) {
          const links = document.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(link => {
            if (cssFile && !link.href.includes(cssFile)) return;
            const href = link.href.split('?')[0];
            link.href = href + '?t=' + Date.now();
          });
        }
        
        ws.onmessage = function(event) {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'reload') {
              removeErrorOverlay();
              window.location.reload();
            } else if (message.type === 'css-update') {
              removeErrorOverlay();
              hotReloadCSS(message.file);
            } else if (message.type === 'error') {
              createErrorOverlay(message.message);
            }
          } catch (e) {
            // Legacy string message
            if (event.data === 'reload') {
              removeErrorOverlay();
              window.location.reload();
            }
          }
        };
        
        ws.onopen = function() {
          removeErrorOverlay();
        };
        
        ws.onclose = function() {
          setTimeout(function() {
            window.location.reload();
          }, 1000);
        };
        
        // Capture unhandled errors
        window.addEventListener('error', function(e) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'console',
              method: 'error',
              args: ['Uncaught Error:', e.message, 'at', e.filename + ':' + e.lineno]
            }));
          }
        });
      })();
    </script>
  `;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel("Live Server++");
  }

  async start(config: ServerConfig): Promise<number> {
    this.config = config;
    this.rootPath = config.rootPath;
    this.workspacePath = config.workspacePath;
    this.port = await this.findAvailablePort(config.port);

    // Initialize document cache with currently open documents
    this.initializeDocumentCache();

    return new Promise((resolve, reject) => {
      try {
        // Create HTTP server
        this.httpServer = http.createServer((req, res) =>
          this.handleRequest(req, res)
        );

        this.httpServer.on("error", (error: NodeJS.ErrnoException) => {
          if (error.code === "EADDRINUSE") {
            reject(new Error(`Port ${this.port} is already in use`));
          } else {
            reject(error);
          }
        });

        this.httpServer.listen(this.port, () => {
          this.outputChannel.appendLine(
            `✨ Live Server++ started on http://localhost:${this.port}`
          );
          this.outputChannel.appendLine(`📂 Serving: ${this.rootPath}`);
          this.outputChannel.appendLine(
            `⚡ Live reload enabled (${config.autoReloadDelay}ms delay)`
          );
          this.outputChannel.appendLine(
            `🔥 Serving unsaved changes in real-time\n`
          );
          this.outputChannel.appendLine(
            `📝 Browser console output will appear below:\n`
          );

          // Create WebSocket server for live reload
          if (this.httpServer) {
            this.wsServer = new WebSocketServer({
              server: this.httpServer,
              path: "/__live_reload",
            });

            this.wsServer.on("connection", (ws: WebSocket) => {
              if (config.verboseLogging) {
                this.outputChannel.appendLine("[Verbose] Browser connected");
              }
              this.clients.add(ws);

              ws.on("message", (data: Buffer) => {
                if (config.showConsoleLog) {
                  try {
                    const message = JSON.parse(data.toString());
                    if (message.type === "console") {
                      // Filter out Live Server's own internal logs
                      const output = message.args.join(" ");
                      if (!output.includes("[Live Server++]")) {
                        const prefix = `[${message.method.toUpperCase()}]`;
                        this.outputChannel.appendLine(`${prefix} ${output}`);
                      }
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              });

              ws.on("close", () => {
                if (config.verboseLogging) {
                  this.outputChannel.appendLine(
                    "[Verbose] Browser disconnected"
                  );
                }
                this.clients.delete(ws);
              });
            });
          }

          // Setup file watcher with auto-reload
          this.setupAutoReload();

          resolve(this.port);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private initializeDocumentCache(): void {
    // Cache all currently open text documents
    vscode.workspace.textDocuments.forEach((doc) => {
      if (
        doc.uri.scheme === "file" &&
        doc.uri.fsPath.startsWith(this.workspacePath)
      ) {
        this.documentCache.set(doc.uri.fsPath, doc.getText());
      }
    });
  }

  private async findAvailablePort(startPort: number): Promise<number> {
    let port = startPort;
    const maxAttempts = 100;

    for (let i = 0; i < maxAttempts; i++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
      port++;
    }

    throw new Error("No available ports found");
  }

  private isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = http.createServer();

      server.once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          resolve(false);
        } else {
          resolve(false);
        }
      });

      server.once("listening", () => {
        server.close();
        resolve(true);
      });

      server.listen(port);
    });
  }

  private handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    try {
      // Add CORS headers if enabled
      if (this.config?.enableCORS) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );

        if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
        }
      }

      // Parse URL and remove query strings
      let urlPath = req.url?.split("?")[0] || "/";

      // Default to index.html for root
      if (urlPath === "/") {
        urlPath = "/index.html";
      }

      // Construct file path
      let filePath = path.join(this.rootPath, urlPath);

      // Security check: prevent directory traversal
      const normalizedPath = path.normalize(filePath);
      if (!normalizedPath.startsWith(this.rootPath)) {
        this.sendError(res, 403, "Forbidden", "Access denied");
        return;
      }

      // Check if we have this file in memory cache (unsaved changes)
      let content: Buffer | undefined = undefined;
      let fromCache = false;

      if (this.documentCache.has(normalizedPath)) {
        // Serve from in-memory cache (unsaved content)
        content = Buffer.from(this.documentCache.get(normalizedPath)!, "utf-8");
        fromCache = true;
      } else {
        // Check if file exists on disk
        if (!fs.existsSync(filePath)) {
          // Try with .html extension
          if (!path.extname(filePath)) {
            const htmlPath = filePath + ".html";
            if (fs.existsSync(htmlPath)) {
              filePath = htmlPath;
            } else if (this.documentCache.has(htmlPath)) {
              filePath = htmlPath;
              content = Buffer.from(this.documentCache.get(htmlPath)!, "utf-8");
              fromCache = true;
            } else {
              this.send404(res, urlPath);
              return;
            }
          } else {
            this.send404(res, urlPath);
            return;
          }
        }

        // If not from cache yet, check if it's a directory
        if (!fromCache) {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            const indexPath = path.join(filePath, "index.html");
            if (fs.existsSync(indexPath)) {
              filePath = indexPath;
            } else if (this.documentCache.has(indexPath)) {
              filePath = indexPath;
              content = Buffer.from(
                this.documentCache.get(indexPath)!,
                "utf-8"
              );
              fromCache = true;
            } else {
              this.sendDirectoryListing(res, filePath, urlPath);
              return;
            }
          }
        }

        // Read from disk if not from cache
        if (!fromCache && !content) {
          content = fs.readFileSync(filePath);
        }
      }

      // If still no content, return 404
      if (!content) {
        this.send404(res, urlPath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeType = this.MIME_TYPES[ext] || "application/octet-stream";

      // Inject live reload script for HTML files
      if (ext === ".html") {
        let htmlContent = content.toString("utf-8");

        // Inject before closing body tag or at the end
        if (htmlContent.includes("</body>")) {
          htmlContent = htmlContent.replace(
            "</body>",
            `${this.LIVE_RELOAD_SCRIPT}</body>`
          );
        } else if (htmlContent.includes("</html>")) {
          htmlContent = htmlContent.replace(
            "</html>",
            `${this.LIVE_RELOAD_SCRIPT}</html>`
          );
        } else {
          htmlContent += this.LIVE_RELOAD_SCRIPT;
        }

        content = Buffer.from(htmlContent, "utf-8");
      }

      res.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Length": content.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Content-Type-Options": "nosniff",
        "X-Served-From": fromCache ? "memory" : "disk",
      });

      res.end(content);
    } catch (error) {
      console.error("Error handling request:", error);
      this.sendError(
        res,
        500,
        "Internal Server Error",
        "An error occurred while processing your request"
      );
    }
  }

  private sendError(
    res: http.ServerResponse,
    statusCode: number,
    title: string,
    message: string
  ): void {
    res.writeHead(statusCode, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${statusCode} - ${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 40px;
              max-width: 500px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
            }
            .error-code {
              font-size: 72px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
            }
            h1 { 
              color: #333;
              margin-bottom: 15px;
              font-size: 24px;
            }
            p { 
              color: #666;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-code">${statusCode}</div>
            <h1>${title}</h1>
            <p>${message}</p>
            <div class="footer">Live Server++</div>
          </div>
        </body>
      </html>
    `);
  }

  private send404(res: http.ServerResponse, requestedPath: string): void {
    // Try to find similar files
    const suggestions = this.findSimilarFiles(requestedPath);

    let suggestionsHTML = "";
    if (suggestions.length > 0) {
      suggestionsHTML = `
        <div style="margin-top: 20px; text-align: left;">
          <strong>Did you mean?</strong>
          <ul style="margin-top: 10px; list-style: none; padding: 0;">
            ${suggestions
              .map(
                (file) => `
              <li style="margin: 5px 0;">
                <a href="${file}" style="color: #667eea; text-decoration: none;">
                  ${file}
                </a>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    }

    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>404 - Not Found</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 40px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .error-code {
              font-size: 72px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
              text-align: center;
            }
            h1 { 
              color: #333;
              margin-bottom: 15px;
              font-size: 24px;
              text-align: center;
            }
            .path {
              background: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              font-family: monospace;
              margin: 20px 0;
              word-break: break-all;
            }
            a {
              color: #667eea;
              text-decoration: none;
              transition: color 0.2s;
            }
            a:hover {
              color: #764ba2;
              text-decoration: underline;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 14px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-code">404</div>
            <h1>Page Not Found</h1>
            <div class="path">${requestedPath}</div>
            <p style="text-align: center; color: #666;">
              The requested file could not be found.
            </p>
            ${suggestionsHTML}
            <div class="footer">
              <a href="/">← Back to Home</a> | Live Server++
            </div>
          </div>
        </body>
      </html>
    `);
  }

  private findSimilarFiles(requestedPath: string): string[] {
    try {
      const dir = path.dirname(path.join(this.rootPath, requestedPath));
      if (!fs.existsSync(dir)) return [];

      const files = fs.readdirSync(dir);
      const requestedFile = path.basename(requestedPath).toLowerCase();

      // Find files with similar names
      const similar = files
        .filter((file) => {
          const fileLower = file.toLowerCase();
          return (
            fileLower.includes(requestedFile.slice(0, 3)) ||
            requestedFile.includes(fileLower.slice(0, 3))
          );
        })
        .slice(0, 5)
        .map((file) =>
          path.join(path.dirname(requestedPath), file).replace(/\\/g, "/")
        );

      return similar;
    } catch (error) {
      return [];
    }
  }

  private sendDirectoryListing(
    res: http.ServerResponse,
    dirPath: string,
    urlPath: string
  ): void {
    try {
      const files = fs.readdirSync(dirPath);

      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Directory: ${urlPath}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: #f5f5f5;
                padding: 20px;
              }
              .container {
                max-width: 900px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { 
                color: #333;
                margin-bottom: 10px;
                font-size: 28px;
              }
              .path {
                color: #666;
                margin-bottom: 30px;
                font-family: monospace;
                font-size: 14px;
              }
              ul { 
                list-style: none;
              }
              li { 
                padding: 12px;
                border-bottom: 1px solid #eee;
                transition: background 0.2s;
              }
              li:hover {
                background: #f9f9f9;
              }
              a { 
                text-decoration: none;
                color: #667eea;
                display: flex;
                align-items: center;
              }
              a:hover { 
                color: #764ba2;
              }
              .icon {
                margin-right: 10px;
                font-size: 20px;
              }
              .folder { color: #ffa502; }
              .file { color: #667eea; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📁 Directory Browser</h1>
              <div class="path">${urlPath}</div>
              <ul>
      `;

      // Add parent directory link
      if (urlPath !== "/") {
        const parentPath = path.dirname(urlPath);
        html += `
          <li>
            <a href="${parentPath}">
              <span class="icon">📁</span>
              <span>..</span>
            </a>
          </li>
        `;
      }

      // Sort: folders first, then files
      const sorted = files.sort((a, b) => {
        const aPath = path.join(dirPath, a);
        const bPath = path.join(dirPath, b);
        const aIsDir = fs.statSync(aPath).isDirectory();
        const bIsDir = fs.statSync(bPath).isDirectory();

        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

      sorted.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        const isDir = stat.isDirectory();
        const href = path.join(urlPath, file).replace(/\\/g, "/");
        const icon = isDir ? "📁" : "📄";
        const className = isDir ? "folder" : "file";

        html += `
          <li>
            <a href="${href}">
              <span class="icon ${className}">${icon}</span>
              <span>${file}</span>
            </a>
          </li>
        `;
      });

      html += `
              </ul>
            </div>
          </body>
        </html>
      `;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (error) {
      this.sendError(
        res,
        500,
        "Internal Server Error",
        "Error reading directory"
      );
    }
  }

  private setupAutoReload(): void {
    if (!this.config) return;

    const debounceTimers = new Map<string, NodeJS.Timeout>();

    // Listen to text document changes (as you type)
    const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
      const doc = event.document;

      // Only watch files in workspace
      if (!doc.uri.fsPath.startsWith(this.workspacePath)) return;

      const ext = path.extname(doc.fileName).toLowerCase();

      // Only watch relevant files
      if (![".html", ".css", ".js", ".json"].includes(ext)) return;

      // Update document cache with latest content
      this.documentCache.set(doc.uri.fsPath, doc.getText());

      // Clear existing timer for this file
      const existingTimer = debounceTimers.get(doc.uri.fsPath);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounced timer
      const timer = setTimeout(() => {
        if (this.config!.verboseLogging) {
          this.outputChannel.appendLine(
            `[Verbose] File changed: ${path.basename(doc.fileName)}`
          );
        }

        // CSS gets hot-reloaded, others trigger full reload
        if (ext === ".css") {
          this.sendToClients({
            type: "css-update",
            file: path.basename(doc.fileName),
          });
        } else {
          this.sendToClients({ type: "reload" });
        }

        debounceTimers.delete(doc.uri.fsPath);
      }, this.config!.autoReloadDelay);

      debounceTimers.set(doc.uri.fsPath, timer);
    });

    // Listen when documents are saved
    const saveListener = vscode.workspace.onDidSaveTextDocument((doc) => {
      if (
        doc.uri.fsPath.startsWith(this.workspacePath) &&
        this.config!.verboseLogging
      ) {
        this.outputChannel.appendLine(
          `[Verbose] File saved: ${path.basename(doc.fileName)}`
        );
      }
    });

    // Listen when documents are closed (remove from cache)
    const closeListener = vscode.workspace.onDidCloseTextDocument((doc) => {
      if (doc.uri.fsPath.startsWith(this.workspacePath)) {
        this.documentCache.delete(doc.uri.fsPath);
        if (this.config!.verboseLogging) {
          this.outputChannel.appendLine(
            `[Verbose] Document closed: ${path.basename(doc.fileName)}`
          );
        }
      }
    });

    // Also watch for file system changes (for images, etc.)
    const pattern = new vscode.RelativePattern(
      this.workspacePath,
      "**/*.{png,jpg,jpeg,gif,svg,webp,ico}"
    );
    const fsWatcher = vscode.workspace.createFileSystemWatcher(pattern);

    const handleFSChange = (uri: vscode.Uri) => {
      if (this.config!.verboseLogging) {
        this.outputChannel.appendLine(
          `[Verbose] Asset changed: ${path.basename(uri.fsPath)}`
        );
      }
      this.sendToClients({ type: "reload" });
    };

    fsWatcher.onDidChange(handleFSChange);
    fsWatcher.onDidCreate(handleFSChange);
    fsWatcher.onDidDelete(handleFSChange);

    // Store disposables
    this.fileWatcher = vscode.Disposable.from(
      changeListener,
      saveListener,
      closeListener,
      fsWatcher
    );
  }

  private sendToClients(message: ReloadMessage): void {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  stop(): void {
    // Close all WebSocket connections
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients.clear();

    // Close WebSocket server
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = undefined;
    }

    // Close HTTP server
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = undefined;
    }

    // Dispose file watcher
    if (this.fileWatcher) {
      this.fileWatcher.dispose();
      this.fileWatcher = undefined;
    }

    // Clear document cache
    this.documentCache.clear();

    this.outputChannel.appendLine("\n🛑 Live Server++ stopped");
  }

  getPort(): number {
    return this.port;
  }

  isRunning(): boolean {
    return this.httpServer !== undefined;
  }

  getOutputChannel(): vscode.OutputChannel {
    return this.outputChannel;
  }
}
