import * as vscode from "vscode";
import * as path from "path";
import { LiveServer } from "./server";

let liveServer: LiveServer | null = null;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log("Live Server++ extension is now active");

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "liveServerPlusPlus.stop";
  context.subscriptions.push(statusBarItem);

  // Register start command
  const startCommand = vscode.commands.registerCommand(
    "liveServerPlusPlus.start",
    async (uri?: vscode.Uri) => {
      if (liveServer && liveServer.isRunning()) {
        vscode.window.showWarningMessage("Live Server++ is already running!");
        return;
      }

      try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showErrorMessage("No workspace folder open");
          return;
        }

        // Determine root path
        let rootPath: string;
        if (uri && uri.fsPath) {
          // If file is selected, use its directory
          const stat = await vscode.workspace.fs.stat(uri);
          if (stat.type === vscode.FileType.Directory) {
            rootPath = uri.fsPath;
          } else {
            rootPath = path.dirname(uri.fsPath);
          }
        } else {
          // Use workspace root
          rootPath = workspaceFolder.uri.fsPath;
        }

        // Get configuration
        const config = vscode.workspace.getConfiguration("liveServerPlusPlus");
        const defaultPort = config.get<number>("port", 3000);
        const browser = config.get<string>("browser", "default");
        const autoReloadDelay = config.get<number>("autoReloadDelay", 100);
        const enableCORS = config.get<boolean>("enableCORS", true);
        const showConsoleLog = config.get<boolean>("showConsoleLog", true);
        const verboseLogging = config.get<boolean>("verboseLogging", false);

        // Start server
        liveServer = new LiveServer();
        const port = await liveServer.start({
          port: defaultPort,
          rootPath: rootPath,
          workspacePath: workspaceFolder.uri.fsPath,
          autoReloadDelay: autoReloadDelay,
          enableCORS: enableCORS,
          showConsoleLog: showConsoleLog,
          verboseLogging: verboseLogging,
        });

        // Show output channel
        liveServer.getOutputChannel().show(true);

        // Update status bar
        statusBarItem.text = `$(radio-tower) Live Server++: ${port}`;
        statusBarItem.tooltip =
          "Click to stop Live Server++\n\nFeatures:\n• Auto-reload as you type\n• CSS hot reload\n• Console forwarding\n• CORS enabled";
        statusBarItem.show();

        // Open browser
        const url = `http://localhost:${port}`;
        await openBrowser(url, browser);

        vscode.window
          .showInformationMessage(
            `Live Server++ started on port ${port}`,
            "Open Browser",
            "Show Output"
          )
          .then((selection) => {
            if (selection === "Open Browser") {
              vscode.env.openExternal(vscode.Uri.parse(url));
            } else if (selection === "Show Output" && liveServer) {
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
      }
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
      statusBarItem.hide();
      vscode.window.showInformationMessage(
        `Live Server++ stopped (was on port ${port})`
      );
    }
  );

  context.subscriptions.push(startCommand, stopCommand);
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
      // Use VS Code's built-in browser opener
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
