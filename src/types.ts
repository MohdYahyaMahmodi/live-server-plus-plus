export interface ServerConfig {
  port: number;
  rootPath: string;
  workspacePath: string;
  autoReloadDelay: number;
  enableCORS: boolean;
  showConsoleLog: boolean;
  verboseLogging: boolean;
}

export interface ServerInstance {
  httpServer: any;
  wsServer: any;
  port: number;
  isRunning: boolean;
}

export interface ReloadMessage {
  type: "reload" | "css-update" | "console" | "error";
  data?: any;
  file?: string;
  method?: string;
  args?: any[];
  message?: string;
}
