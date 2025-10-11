import * as vscode from "vscode";
import * as path from "path";
import { LiveServer } from "./server";
import { LiveServerTreeProvider, FileItem } from "./treeview";

let liveServer: LiveServer | null = null;
let statusBarItem: vscode.StatusBarItem;
let treeProvider: LiveServerTreeProvider;

export function activate(context: vscode.ExtensionContext) {
  console.log("Live Server++ extension is now active");

  // Create tree view provider for sidebar
  treeProvider = new LiveServerTreeProvider();
  const treeView = vscode.window.createTreeView("liveServerPlusPlus", {
    treeDataProvider: treeProvider,
    showCollapseAll: false,
  });

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);

  // Update status bar when active editor changes
  vscode.window.onDidChangeActiveTextEditor(() => {
    updateStatusBar();
  });

  updateStatusBar();
  statusBarItem.show();

  // Register start command (with optional URI)
  const startCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.start",
    async (uri?: vscode.Uri) => {
      await startServer(uri);
    }
  );

  // Register start with file picker
  const startWithPickerCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.startWithPicker",
    async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder open");
        return;
      }

      // Find all HTML files in workspace
      const htmlFiles = await vscode.workspace.findFiles(
        "**/*.{html,htm}",
        "**/node_modules/**"
      );

      if (htmlFiles.length === 0) {
        vscode.window.showErrorMessage(
          "No HTML files found in workspace. Please create an HTML file first."
        );
        return;
      }

      // Create quick pick items
      const items = htmlFiles.map((file) => {
        const relativePath = path.relative(
          workspaceFolder.uri.fsPath,
          file.fsPath
        );
        return {
          label: path.basename(file.fsPath),
          description: relativePath,
          uri: file,
        };
      });

      // Show quick pick
      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select an HTML file to open with Live Server++",
        matchOnDescription: true,
      });

      if (selected) {
        await startServer(selected.uri);
      }
    }
  );

  // Register open current file command
  const openCurrentCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.openCurrent",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showWarningMessage(
          "No active file. Please open an HTML file first."
        );
        return;
      }

      const uri = activeEditor.document.uri;
      const ext = path.extname(uri.fsPath).toLowerCase();

      if (ext !== ".html" && ext !== ".htm") {
        vscode.window.showWarningMessage(
          "Current file is not an HTML file. Please open an HTML file."
        );
        return;
      }

      await startServer(uri);
    }
  );

  // Register stop command
  const stopCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.stop",
    () => {
      if (!liveServer || !liveServer.isRunning()) {
        vscode.window.showWarningMessage("Live Server++ is not running");
        return;
      }

      const port = liveServer.getPort();
      liveServer.stop();
      liveServer = null;

      updateStatusBar();
      treeProvider.setServerRunning(false, 0);
      treeProvider.clearOpenedFiles();

      vscode.window.showInformationMessage(
        `Live Server++ stopped (port ${port})`
      );
    }
  );

  // Register command to open URL from tree view
  const openUrlCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.openUrl",
    async (item: FileItem) => {
      if (item.url) {
        const config = vscode.workspace.getConfiguration("liveServerPlusPlus");
        const browser = config.get<string>("browser", "default");
        await openBrowser(item.url, browser);
      }
    }
  );

  // Register command to remove file from list
  const removeFileCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.removeFile",
    async (item: FileItem) => {
      if (item.filename) {
        treeProvider.removeOpenedFile(item.filename);
      }
    }
  );

  // Register refresh command
  const refreshCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.refresh",
    () => {
      treeProvider.refresh();
    }
  );

  context.subscriptions.push(
    treeView,
    startCommand,
    startWithPickerCommand,
    openCurrentCommand,
    stopCommand,
    openUrlCommand,
    removeFileCommand,
    refreshCommand
  );
}

async function startServer(uri?: vscode.Uri): Promise<void> {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder open");
      return;
    }

    const workspaceRoot = workspaceFolder.uri.fsPath;
    let fileToOpen = "";

    if (uri && uri.fsPath) {
      const stat = await vscode.workspace.fs.stat(uri);
      if (stat.type === vscode.FileType.File) {
        const relativePath = path.relative(workspaceRoot, uri.fsPath);
        fileToOpen = relativePath.replace(/\\/g, "/");
      }
    }

    // If server is already running, just open the file
    if (liveServer && liveServer.isRunning()) {
      const port = liveServer.getPort();
      const url = fileToOpen
        ? `http://localhost:${port}/${fileToOpen}`
        : `http://localhost:${port}`;

      const config = vscode.workspace.getConfiguration("liveServerPlusPlus");
      const browser = config.get<string>("browser", "default");

      await openBrowser(url, browser);

      // Add to opened files list
      if (fileToOpen) {
        treeProvider.addOpenedFile(fileToOpen, url);
        vscode.window.showInformationMessage(`Opened ${fileToOpen}`);
      }
      return;
    }

    // Start server
    const config = vscode.workspace.getConfiguration("liveServerPlusPlus");
    const defaultPort = config.get<number>("port", 3000);
    const browser = config.get<string>("browser", "default");
    const autoReloadDelay = config.get<number>("autoReloadDelay", 100);
    const enableCORS = config.get<boolean>("enableCORS", true);
    const showConsoleLog = config.get<boolean>("showConsoleLog", true);
    const verboseLogging = config.get<boolean>("verboseLogging", false);

    liveServer = new LiveServer();
    const port = await liveServer.start({
      port: defaultPort,
      rootPath: workspaceRoot,
      workspacePath: workspaceRoot,
      autoReloadDelay: autoReloadDelay,
      enableCORS: enableCORS,
      showConsoleLog: showConsoleLog,
      verboseLogging: verboseLogging,
    });

    liveServer.getOutputChannel().show(true);

    // Update UI
    updateStatusBar();
    treeProvider.setServerRunning(true, port);

    const url = fileToOpen
      ? `http://localhost:${port}/${fileToOpen}`
      : `http://localhost:${port}`;

    if (fileToOpen) {
      treeProvider.addOpenedFile(fileToOpen, url);
    }

    await openBrowser(url, browser);

    vscode.window
      .showInformationMessage(
        `Live Server++ started on port ${port}`,
        "Show Output"
      )
      .then((selection) => {
        if (selection === "Show Output" && liveServer) {
          liveServer.getOutputChannel().show();
        }
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    vscode.window.showErrorMessage(
      `Failed to start Live Server++: ${errorMessage}`
    );
    liveServer = null;
    updateStatusBar();
    treeProvider.setServerRunning(false, 0);
  }
}

function updateStatusBar(): void {
  const isRunning = liveServer && liveServer.isRunning();

  if (isRunning) {
    const port = liveServer!.getPort();
    statusBarItem.text = `$(radio-tower) Close Live Server++`;
    statusBarItem.tooltip = `Live Server running on port ${port}\nClick to stop server`;
    statusBarItem.command = "liveServerPlusPlus.stop";
  } else {
    // Check if current file is HTML
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const ext = path.extname(activeEditor.document.uri.fsPath).toLowerCase();
      if (ext === ".html" || ext === ".htm") {
        const filename = path.basename(activeEditor.document.uri.fsPath);
        statusBarItem.text = `$(radio-tower) Open with Live Server++`;
        statusBarItem.tooltip = `Open ${filename} with Live Server++`;
        statusBarItem.command = "liveServerPlusPlus.openCurrent";
        return;
      }
    }

    statusBarItem.text = "$(radio-tower) Open with Live Server++";
    statusBarItem.tooltip = "Start Live Server++";
    statusBarItem.command = "liveServerPlusPlus.startWithPicker";
  }
}

async function openBrowser(url: string, browser: string): Promise<void> {
  let command: string;

  switch (browser) {
    case "chrome":
      command =
        process.platform === "darwin"
          ? 'open -a "Google Chrome"'
          : process.platform === "win32"
          ? "start chrome"
          : "google-chrome";
      break;
    case "firefox":
      command =
        process.platform === "darwin"
          ? 'open -a "Firefox"'
          : process.platform === "win32"
          ? "start firefox"
          : "firefox";
      break;
    case "edge":
      command =
        process.platform === "darwin"
          ? 'open -a "Microsoft Edge"'
          : process.platform === "win32"
          ? "start msedge"
          : "microsoft-edge";
      break;
    default:
      await vscode.env.openExternal(vscode.Uri.parse(url));
      return;
  }

  const { exec } = require("child_process");
  exec(`${command} ${url}`, (error: Error | null) => {
    if (error) {
      console.error("Failed to open browser:", error);
      vscode.env.openExternal(vscode.Uri.parse(url));
    }
  });
}

export function deactivate() {
  if (liveServer && liveServer.isRunning()) {
    liveServer.stop();
  }
}
