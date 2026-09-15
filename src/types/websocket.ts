// types/websocket.ts

/**
 * WebSocket 连接状态
 */
export enum WebSocketStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Error = 'error'
}

/**
 * 日志级别（控制台风格）
 */
export enum ConsoleLevel {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Debug = 'debug',
  System = 'system',
  Send = 'send',
  Receive = 'receive'
}

/**
 * 控制台日志条目
 */
export interface ConsoleLogEntry {
  id: string;
  timestamp: Date;
  level: ConsoleLevel;
  message: string;
  source?: string;
  details?: any;
}

/**
 * WebSocket 配置
 */
export interface WebSocketConfig {
  url: string;
  userId?: string;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  pingInterval?: number;
}

/**
 * 服务端消息格式
 */
export interface ServerMessage {
  type?: string;
  connectionId?: string;
  userId?: string;
  message?: string;
  data?: any;
  timestamp?: string;
}