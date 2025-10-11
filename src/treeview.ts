import * as vscode from "vscode";

export class FileItem extends vscode.TreeItem {
  public filename?: string;
  public url?: string;

  constructor(
    label: string,
    url?: string,
    collapsibleState?: vscode.TreeItemCollapsibleState,
    iconPath?: vscode.ThemeIcon,
    contextValue?: string
  ) {
    super(label, collapsibleState);

    this.url = url;

    if (contextValue) {
      this.contextValue = contextValue;
    }

    if (iconPath) {
      this.iconPath = iconPath;
    }

    if (url) {
      this.tooltip = url;
      this.command = {
        command: "liveServerPlusPlus.openUrl",
        title: "Open in Browser",
        arguments: [this],
      };
    }
  }
}

export class LiveServerTreeProvider
  implements vscode.TreeDataProvider<FileItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    FileItem | undefined | null | void
  > = new vscode.EventEmitter<FileItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    FileItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private isRunning: boolean = false;
  private port: number = 0;
  private openedFiles: Map<string, string> = new Map();

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setServerRunning(running: boolean, port: number): void {
    this.isRunning = running;
    this.port = port;
    this.refresh();
  }

  addOpenedFile(filename: string, url: string): void {
    this.openedFiles.set(filename, url);
    this.refresh();
  }

  removeOpenedFile(filename: string): void {
    this.openedFiles.delete(filename);
    this.refresh();
  }

  clearOpenedFiles(): void {
    this.openedFiles.clear();
    this.refresh();
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileItem): Thenable<FileItem[]> {
    if (!element) {
      const items: FileItem[] = [];

      // ========== SERVER STATUS SECTION ==========
      const statusItem = new FileItem(
        "SERVER STATUS",
        undefined,
        vscode.TreeItemCollapsibleState.None,
        new vscode.ThemeIcon("server"),
        "section"
      );
      items.push(statusItem);

      if (this.isRunning) {
        const runningItem = new FileItem(
          "Running",
          undefined,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon(
            "pass-filled",
            new vscode.ThemeColor("testing.iconPassed")
          )
        );
        runningItem.description = `Port ${this.port}`;
        items.push(runningItem);

        const urlItem = new FileItem(
          `http://localhost:${this.port}`,
          `http://localhost:${this.port}`,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon("globe")
        );
        urlItem.tooltip = "Click to open in browser";
        items.push(urlItem);
      } else {
        items.push(
          new FileItem(
            "Stopped",
            undefined,
            vscode.TreeItemCollapsibleState.None,
            new vscode.ThemeIcon(
              "circle-large-outline",
              new vscode.ThemeColor("testing.iconErrored")
            )
          )
        );
      }

      // ========== QUICK ACTIONS SECTION ==========
      items.push(
        new FileItem("", undefined, vscode.TreeItemCollapsibleState.None)
      );

      const actionsItem = new FileItem(
        "QUICK ACTIONS",
        undefined,
        vscode.TreeItemCollapsibleState.None,
        new vscode.ThemeIcon("zap"),
        "section"
      );
      items.push(actionsItem);

      if (this.isRunning) {
        // Open Current File button
        const openCurrentItem = new FileItem(
          "Open Current File",
          undefined,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon(
            "file-code",
            new vscode.ThemeColor("charts.blue")
          )
        );
        openCurrentItem.command = {
          command: "liveServerPlusPlus.openCurrent",
          title: "Open Current File",
        };
        openCurrentItem.tooltip = "Open the currently active HTML file";
        items.push(openCurrentItem);

        // Stop Server button
        const stopItem = new FileItem(
          "Stop Server",
          undefined,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon(
            "debug-stop",
            new vscode.ThemeColor("testing.iconErrored")
          )
        );
        stopItem.command = {
          command: "liveServerPlusPlus.stop",
          title: "Stop Server",
        };
        stopItem.tooltip = "Stop Live Server++";
        items.push(stopItem);
      } else {
        // Start Server button
        const startItem = new FileItem(
          "Start Server",
          undefined,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon(
            "play",
            new vscode.ThemeColor("testing.iconPassed")
          )
        );
        startItem.command = {
          command: "liveServerPlusPlus.startWithPicker",
          title: "Start Server",
        };
        startItem.tooltip = "Choose an HTML file and start the server";
        items.push(startItem);
      }

      // ========== ACTIVE FILES SECTION ==========
      if (this.isRunning && this.openedFiles.size > 0) {
        items.push(
          new FileItem("", undefined, vscode.TreeItemCollapsibleState.None)
        );

        const filesHeaderItem = new FileItem(
          "ACTIVE FILES",
          undefined,
          vscode.TreeItemCollapsibleState.None,
          new vscode.ThemeIcon("files"),
          "section"
        );
        filesHeaderItem.description = `${this.openedFiles.size}`;
        items.push(filesHeaderItem);

        // List all opened files
        this.openedFiles.forEach((url, filename) => {
          const fileItem = new FileItem(
            filename,
            url,
            vscode.TreeItemCollapsibleState.None,
            new vscode.ThemeIcon("file-code"),
            "openedFile"
          );
          fileItem.filename = filename;
          fileItem.tooltip = `${url}\nClick to open in browser`;
          items.push(fileItem);
        });

        // Clear All button
        if (this.openedFiles.size > 1) {
          const clearAllItem = new FileItem(
            "Clear All",
            undefined,
            vscode.TreeItemCollapsibleState.None,
            new vscode.ThemeIcon("clear-all")
          );
          clearAllItem.command = {
            command: "liveServerPlusPlus.stop",
            title: "Clear All",
          };
          clearAllItem.tooltip = "Remove all files from the list";
          items.push(clearAllItem);
        }
      }

      return Promise.resolve(items);
    }

    return Promise.resolve([]);
  }
}
