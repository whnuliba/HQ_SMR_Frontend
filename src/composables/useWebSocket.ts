// composables/useWebSocket.ts

import { ref, computed, onUnmounted, type Ref } from 'vue';
import { 
  WebSocketStatus, 
  ConsoleLevel, 
  type ConsoleLogEntry, 
  type WebSocketConfig, 
  type ServerMessage 
} from '@/types/websocket';

export function useWebSocket(config: Ref<WebSocketConfig>) {
  // ============================================================
  // 状态
  // ============================================================
  
  const ws = ref<WebSocket | null>(null);
  const status = ref<WebSocketStatus>(WebSocketStatus.Disconnected);
  const connectionId = ref<string>('');
  const userId = ref<string>('');
  const logs = ref<ConsoleLogEntry[]>([]);
  const reconnectAttempts = ref(0);
  const isManualClose = ref(false);
  const isLogsPaused = ref(false);

  // Ping 定时器
  let pingTimer: number | null = null;
  let reconnectTimer: number | null = null;

  // ============================================================
  // 计算属性
  // ============================================================
  
  const isConnected = computed(() => status.value === WebSocketStatus.Connected);
  const isConnecting = computed(() => status.value === WebSocketStatus.Connecting || status.value === WebSocketStatus.Reconnecting);
  const logCount = computed(() => logs.value.length);

  // ============================================================
  // 控制台日志系统（Jenkins 风格）
  // ============================================================
  
  const addLog = (
    level: ConsoleLevel, 
    message: string, 
    source?: string, 
    details?: any
  ) => {
    if (isLogsPaused.value) return;

    const entry: ConsoleLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      source: source || 'system',
      details
    };
    
    logs.value.push(entry);
    
    // 限制日志数量（保留最近 1000 条）
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(logs.value.length - 1000);
    }
  };

  /**
   * 格式化日志时间
   */
  const formatLogTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  };

  /**
   * 获取日志级别的 CSS 类
   */
  const getLogLevelClass = (level: ConsoleLevel): string => {
    const map: Record<ConsoleLevel, string> = {
      [ConsoleLevel.Info]: 'console-info',
      [ConsoleLevel.Success]: 'console-success',
      [ConsoleLevel.Warning]: 'console-warning',
      [ConsoleLevel.Error]: 'console-error',
      [ConsoleLevel.Debug]: 'console-debug',
      [ConsoleLevel.System]: 'console-system',
      [ConsoleLevel.Send]: 'console-send',
      [ConsoleLevel.Receive]: 'console-receive'
    };
    return map[level] || 'console-info';
  };

  /**
   * 获取日志级别的颜色
   */
  const getLogLevelColor = (level: ConsoleLevel): string => {
    const map: Record<ConsoleLevel, string> = {
      [ConsoleLevel.Info]: '#18a058',
      [ConsoleLevel.Success]: '#18a058',
      [ConsoleLevel.Warning]: '#f0a020',
      [ConsoleLevel.Error]: '#d03050',
      [ConsoleLevel.Debug]: '#808080',
      [ConsoleLevel.System]: '#2080f0',
      [ConsoleLevel.Send]: '#7b61ff',
      [ConsoleLevel.Receive]: '#18a058'
    };
    return map[level] || '#808080';
  };

  /**
   * 获取日志级别图标
   */
  const getLogLevelIcon = (level: ConsoleLevel): string => {
    const map: Record<ConsoleLevel, string> = {
      [ConsoleLevel.Info]: 'ℹ️',
      [ConsoleLevel.Success]: '✅',
      [ConsoleLevel.Warning]: '⚠️',
      [ConsoleLevel.Error]: '❌',
      [ConsoleLevel.Debug]: '🔍',
      [ConsoleLevel.System]: '⚙️',
      [ConsoleLevel.Send]: '📤',
      [ConsoleLevel.Receive]: '📥'
    };
    return map[level] || '•';
  };

  // ============================================================
  // 状态更新
  // ============================================================
  
  const updateStatus = (newStatus: WebSocketStatus, message?: string) => {
    status.value = newStatus;
    if (message) {
      addLog(ConsoleLevel.System, message, 'connection');
    }
  };

  // ============================================================
  // 核心功能
  // ============================================================
  
  /**
   * 连接 WebSocket
   */
  const connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (status.value === WebSocketStatus.Connected || status.value === WebSocketStatus.Connecting) {
        resolve();
        return;
      }

      isManualClose.value = false;
      updateStatus(WebSocketStatus.Connecting, `正在连接到 ${config.value.url}...`);

      const wsUrl = buildWebSocketUrl();
      addLog(ConsoleLevel.System, `WebSocket 连接初始化: ${wsUrl}`, 'connection');

      try {
        ws.value = new WebSocket(wsUrl);

        ws.value.onopen = () => {
          handleOpen();
          resolve();
        };

        ws.value.onmessage = (event) => {
          handleMessage(event);
        };

        ws.value.onclose = (event) => {
          handleClose(event);
        };

        ws.value.onerror = (event) => {
          handleError(event);
          reject(new Error('WebSocket 连接错误'));
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        addLog(ConsoleLevel.Error, `连接失败: ${errorMessage}`, 'connection');
        updateStatus(WebSocketStatus.Error, '连接失败');
        reject(error);
      }
    });
  };

  const buildWebSocketUrl = (): string => {
    let url = config.value.url;
    const userIdParam = config.value.userId || 'anonymous';
    
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      url = 'ws://' + url;
    }
    if (!url.endsWith('/')) {
      url += '/';
    }
    return url + userIdParam;
  };

  const handleOpen = () => {
    reconnectAttempts.value = 0;
    updateStatus(WebSocketStatus.Connected, 'WebSocket 连接已建立');
    addLog(ConsoleLevel.Success, '连接成功，等待服务端确认...', 'connection');
    startPingTimer();
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      const message = event.data;
      // 尝试解析 JSON
      if (message.startsWith('{') || message.startsWith('[')) {
        try {
          const data: ServerMessage = JSON.parse(message);
          handleJsonMessage(data);
          return;
        } catch (e) {
          // 不是有效的 JSON
        }
      }

      // 处理特殊消息
      if (message === '"pong"' || message === 'pong') {
        //心跳不需要打印到日志
        //addLog(ConsoleLevel.Receive, '🏓 收到心跳响应', 'ping');
        return;
      }
      // 普通文本消息
      addLog(ConsoleLevel.Receive, message, 'message');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      addLog(ConsoleLevel.Error, `解析消息失败: ${errorMessage}`, 'parser');
    }
  };

  const handleJsonMessage = (data: ServerMessage) => {
    const type = data.type || 'unknown';
    if((data.message && data.message==='pong')||data.data && data.data==='pong')
      return; // 忽略心跳响应的日志输出
    switch (type) {
      case 'connected':
        connectionId.value = data.connectionId || 'unknown';
        userId.value = data.userId || config.value.userId || 'anonymous';
        addLog(ConsoleLevel.Success, `连接确认: ID=${connectionId.value}, 用户=${userId.value}`, 'connection');
        break;

      case 'welcome':
        addLog(ConsoleLevel.Info, `👋 ${data.message || '欢迎连接'}`, 'server');
        break;

      case 'message':
        addLog(ConsoleLevel.Receive, data.data || data.message || JSON.stringify(data), 'message');
        break;

      case 'notification':
        addLog(ConsoleLevel.Info, `📢 ${data.message || JSON.stringify(data)}`, 'notification');
        break;
      case 'error':
        addLog(ConsoleLevel.Error, `❌ ${data.message || JSON.stringify(data)}`, 'server');
        break;

      default:
        addLog(ConsoleLevel.Debug, JSON.stringify(data, null, 2), 'json');
        break;
    }
  };

  const handleClose = (event: CloseEvent) => {
    stopPingTimer();
    
    const wasClean = event.wasClean;
    const code = event.code;
    const reason = event.reason || '无原因';

    if (isManualClose.value) {
      updateStatus(WebSocketStatus.Disconnected, '连接已断开');
      addLog(ConsoleLevel.System, `正常断开 (${code}): ${reason}`, 'connection');
      return;
    }

    if (wasClean) {
      updateStatus(WebSocketStatus.Disconnected, '连接已断开');
      addLog(ConsoleLevel.System, `正常断开 (${code}): ${reason}`, 'connection');
    } else {
      updateStatus(WebSocketStatus.Error, '连接异常断开');
      addLog(ConsoleLevel.Error, `非正常断开 (${code}): ${reason}`, 'connection');
      
      if (config.value.autoReconnect !== false) {
        attemptReconnect();
      }
    }
  };

  const handleError = (event: Event) => {
    addLog(ConsoleLevel.Error, 'WebSocket 发生错误', 'connection');
    console.error('WebSocket 错误:', event);
  };

  // ============================================================
  // 发送消息
  // ============================================================
  
  const sendMessage = (message: string): boolean => {
    if (!isConnected.value || !ws.value) {
      addLog(ConsoleLevel.Error, 'WebSocket 未连接，请先连接', 'send');
      return false;
    }

    try {
      ws.value.send(message);
      
      // 截断长消息
      const displayMessage = message.length > 200 ? message.substring(0, 200) + '...' : message;
      addLog(ConsoleLevel.Send, displayMessage, 'send');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      addLog(ConsoleLevel.Error, `发送失败: ${errorMessage}`, 'send');
      return false;
    }
  };

  const sendJson = (data: any): boolean => {
    try {
      const json = JSON.stringify(data);
      return sendMessage(json);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      addLog(ConsoleLevel.Error, `JSON 序列化失败: ${errorMessage}`, 'send');
      return false;
    }
  };

  const sendPing = (): boolean => {
    if (!isConnected.value) {
      addLog(ConsoleLevel.Warning, 'WebSocket 未连接，无法发送 Ping', 'ping');
      return false;
    }
    addLog(ConsoleLevel.Send, '🏓 发送心跳 Ping', 'ping');
    return sendMessage('ping');
  };

  // ============================================================
  // 重连机制
  // ============================================================
  
  const attemptReconnect = () => {
    const maxAttempts = config.value.maxReconnectAttempts || 5;
    const delay = config.value.reconnectDelay || 3000;

    if (reconnectAttempts.value >= maxAttempts) {
      addLog(ConsoleLevel.Error, `重连失败: 已达到最大重连次数 (${maxAttempts})`, 'reconnect');
      updateStatus(WebSocketStatus.Error, '重连失败');
      return;
    }

    reconnectAttempts.value++;
    updateStatus(WebSocketStatus.Reconnecting, `重连中 (${reconnectAttempts.value}/${maxAttempts})...`);
    addLog(ConsoleLevel.Warning, `第 ${reconnectAttempts.value} 次重连尝试，等待 ${delay}ms...`, 'reconnect');

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      if (!isConnected.value && !isManualClose.value) {
        connect().catch(() => {});
      }
    }, delay);
  };

  // ============================================================
  // 心跳检测
  // ============================================================
  
  const startPingTimer = () => {
    stopPingTimer();
    const interval = config.value.pingInterval || 30000;
    
    pingTimer = window.setInterval(() => {
      if (isConnected.value && ws.value?.readyState === WebSocket.OPEN) {
        try {
          ws.value.send('ping');
        } catch (e) {
          // ignore
        }
      }
    }, interval);
  };

  const stopPingTimer = () => {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  // ============================================================
  // 断开连接
  // ============================================================
  
  const disconnect = () => {
    isManualClose.value = true;
    stopPingTimer();
    
    if (ws.value) {
      try {
        ws.value.close(1000, '用户主动断开');
      } catch (e) {
        // ignore
      }
      ws.value = null;
    }
    
    updateStatus(WebSocketStatus.Disconnected, '已断开连接');
    addLog(ConsoleLevel.System, '用户主动断开连接', 'connection');
  };

  // ============================================================
  // 控制台控制
  // ============================================================
  
  const clearLogs = () => {
    logs.value = [];
    addLog(ConsoleLevel.System, '日志已清空', 'system');
  };

  const pauseLogs = () => {
    isLogsPaused.value = !isLogsPaused.value;
    addLog(
      isLogsPaused.value ? ConsoleLevel.Warning : ConsoleLevel.Info,
      isLogsPaused.value ? '日志已暂停' : '日志已恢复',
      'system'
    );
  };

  const exportLogs = () => {
    const content = logs.value.map(log => {
      const time = formatLogTime(log.timestamp);
      return `[${time}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
    
    addLog(ConsoleLevel.Success, `日志已导出 (${logs.value.length} 条)`, 'export');
  };

  // ============================================================
  // 生命周期
  // ============================================================
  
  onUnmounted(() => {
    disconnect();
  });

  // ============================================================
  // 导出
  // ============================================================
  
  return {
    // 状态
    status,
    isConnected,
    isConnecting,
    connectionId,
    userId,
    logs,
    logCount,
    reconnectAttempts,
    isLogsPaused,

    // 日志工具
    addLog,
    formatLogTime,
    getLogLevelClass,
    getLogLevelColor,
    getLogLevelIcon,

    // 方法
    connect,
    disconnect,
    sendMessage,
    sendJson,
    sendPing,
    clearLogs,
    pauseLogs,
    exportLogs
  };
}