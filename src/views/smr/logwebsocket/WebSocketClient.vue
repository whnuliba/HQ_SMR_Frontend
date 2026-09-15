<!-- components/WebSocketClient.vue -->
<template>
  <div class="websocket-client">
    <n-card :bordered="false" class="main-card">
      <!-- 顶部标题 -->
      <template #header>
        <div class="header-content">
          <n-space align="center" >
            <n-icon size="24" color="#2080f0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </n-icon>
            <span class="title">日志监控客户端</span>
            <n-tag size="small" class="status-tag">
              {{ statusText }}
            </n-tag>
          </n-space>
        </div>
      </template>

      <!-- 连接配置 -->
      <n-grid :cols="24" :x-gap="12" :y-gap="12" class="config-grid">
        <n-grid-item :span="6">
          <n-input
          readonly
            v-model:value="formData.userId"
            placeholder="用户 ID"
            :disabled="isConnected || isConnecting"
            size="small"
          >
            <template #prefix>
              <n-icon size="16"><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-input
          readonly
            v-model:value="formData.url"
            placeholder="ws://localhost:5000/log/"
            :disabled="isConnected || isConnecting"
            size="small"
          >
            <template #prefix>
              <n-icon size="16"><LinkOutline /></n-icon>
            </template>
          </n-input>
        </n-grid-item>
        <n-grid-item :span="6">
          <n-space>
            <n-button
              type="primary"
              size="small"
              :loading="isConnecting"
              :disabled="isConnected"
              @click="handleConnect"
            >
              <template #icon>
                <n-icon><CloudUploadOutline /></n-icon>
              </template>
              连接
            </n-button>
            <n-button
              type="error"
              size="small"
              :disabled="!isConnected"
              @click="handleDisconnect"
            >
              <template #icon>
                <n-icon><CloudOfflineOutline /></n-icon>
              </template>
              断开
            </n-button>
          </n-space>
        </n-grid-item>
      </n-grid>

      <!-- 发送面板 -->
      <!-- <n-divider style="margin: 12px 0" />

      <n-grid :cols="24" :x-gap="12" :y-gap="8">
        <n-grid-item :span="12">
          <n-input
            v-model:value="messageInput"
            placeholder="输入消息，按 Ctrl+Enter 发送..."
            :disabled="!isConnected"
            size="small"
            @keydown.ctrl.enter="handleSendMessage"
          />
        </n-grid-item>
        <n-grid-item :span="12">
          <n-space size="small">
            <n-button
              type="success"
              size="small"
              :disabled="!isConnected || !messageInput.trim()"
              @click="handleSendMessage"
            >
              <template #icon>
                <n-icon><SendOutline /></n-icon>
              </template>
              发送
            </n-button>
            <n-button
              size="small"
              :disabled="!isConnected"
              @click="handleSendPing"
            >
              <template #icon>
                <n-icon><RadioButtonOnOutline /></n-icon>
              </template>
              Ping
            </n-button>
            <n-button
              size="small"
              :disabled="!isConnected"
              @click="handleSendJson"
            >
              <template #icon>
                <n-icon><CodeOutline /></n-icon>
              </template>
              JSON
            </n-button>
          </n-space>
        </n-grid-item>
      </n-grid> -->
    </n-card>

    <!-- 控制台 -->
    <ConsoleLog
      :logs="logs"
      :log-count="logCount"
      :is-connected="isConnected"
      :connection-id="connectionId"
      :user-id="userId"
      :status-text="statusText"
      :is-paused="isLogsPaused"
      :get-log-level-class="getLogLevelClass"
      :get-log-level-icon="getLogLevelIcon"
      :format-time="formatLogTime"
      @clear="handleClearLogs"
      @pause="handlePauseLogs"
      @export="handleExportLogs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import {
  NCard,
  NIcon,
  NTag,
  NButton,
  NInput,
  NGrid,
  NGridItem,
  NSpace,
  NDivider,
  useMessage,
  //type TagType
} from 'naive-ui';
import {
  PersonOutline,
  LinkOutline,
  CloudUploadOutline,
  CloudOfflineOutline,
  SendOutline,
  RadioButtonOnOutline,
  CodeOutline
} from '@vicons/ionicons5';
import ConsoleLog from './ConsoleLog.vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { type WebSocketConfig } from '@/types/websocket';
import { storage } from '@/utils/Storage';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
// ============================================================
// Props & Emits
// ============================================================

const props = defineProps<{
  defaultUserId?: string;
  defaultUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'connected', connectionId: string): void;
  (e: 'disconnected', reason: string): void;
  (e: 'message', message: string): void;
  (e: 'error', error: Error): void;
}>();

// ============================================================
// Naive UI
// ============================================================

const message = useMessage();

// ============================================================
// 表单数据
// ============================================================

const formData = reactive({
  userId: props.defaultUserId ,
  url: props.defaultUrl || 'ws://localhost:5003/log'
});

const messageInput = ref('');

// ============================================================
// WebSocket 配置
// ============================================================

const wsConfig = computed<WebSocketConfig>(() => ({
  url: formData.url,
  userId: formData.userId,
  autoReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,
  pingInterval: 30000
}));
//storage.set(CURRENT_USER, data, ex);
// ============================================================
// WebSocket 实例
// ============================================================

const {
  status,
  isConnected,
  isConnecting,
  connectionId,
  userId,
  logs,
  logCount,
  isLogsPaused,
  connect,
  disconnect,
  sendMessage,
  sendJson,
  sendPing,
  clearLogs,
  pauseLogs,
  exportLogs,
  addLog,
  formatLogTime,
  getLogLevelClass,
  getLogLevelIcon
} = useWebSocket(wsConfig);

// ============================================================
// 计算属性
// ============================================================

const statusText = computed(() => {
  const map: Record<string, string> = {
    connected: '已连接',
    connecting: '连接中...',
    disconnected: '未连接',
    reconnecting: '重连中...',
    error: '连接错误'
  };
  return map[status.value] || status.value;
});


type TagType = 'success' | 'warning' | 'danger' | 'info' | 'primary' |'error'| 'default'

const statusTagType = computed<TagType>(() => {
  const map: Record<string, TagType> = {
    connected: 'success',
    connecting: 'warning',
    disconnected: 'default',
    reconnecting: 'warning',
    error: 'error'
  };
  return map[status.value] || 'default';
});

// ============================================================
// 事件处理
// ============================================================

const handleConnect = async () => {
  try {
    await connect();
    emit('connected', connectionId.value);
    message.success('WebSocket 连接成功');
  } catch (error) {
    const err = error instanceof Error ? error : new Error('连接失败');
    emit('error', err);
    message.error(err.message);
  }
};

const handleDisconnect = () => {
  disconnect();
  emit('disconnected', '用户主动断开');
  message.info('已断开连接');
};

const handleSendMessage = () => {
  if (!messageInput.value.trim()) return;
  
  const success = sendMessage(messageInput.value.trim());
  if (success) {
    emit('message', messageInput.value.trim());
    messageInput.value = '';
  } else {
    message.warning('发送失败，请检查连接状态');
  }
};

const handleSendPing = () => {
  sendPing();
  message.info('已发送 Ping');
};

const handleSendJson = () => {
  const jsonData = {
    type: 'test',
    data: {
      message: 'Hello WebSocket!',
      timestamp: new Date().toISOString(),
      userId: userId.value
    }
  };
  sendJson(jsonData);
  message.success('已发送 JSON 消息');
};

const handleClearLogs = () => {
  clearLogs();
  message.info('日志已清空');
};

const handlePauseLogs = () => {
  pauseLogs();
  message.info(isLogsPaused.value ? '日志已暂停' : '日志已恢复');
};

const handleExportLogs = () => {
  exportLogs();
  message.success('日志已导出');
};

// ============================================================
// 键盘快捷键
// ============================================================
//const ws = new WebSocket(`ws://${window.location.host}/log/231`);
onMounted(() => {
  const user = storage.get(CURRENT_USER)
  user.id? formData.userId = user.id : formData.userId = crypto.randomUUID()

  formData.url = `ws://${window.location.host}/ws/log`
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSendMessage();
    }
  });
});

// ============================================================
// 暴露方法
// ============================================================

defineExpose({
  connect,
  disconnect,
  sendMessage,
  sendJson,
  sendPing,
  clearLogs,
  pauseLogs,
  exportLogs,
  isConnected,
  isConnecting,
  connectionId,
  userId,
  logs,
  status
});
</script>

<style scoped lang="scss">
.websocket-client {
  width: 100%;
  margin: 0 auto;
  padding: 20px;

  .main-card {
    margin-bottom: 16px;

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #e0e0e0;
      }

      .status-tag {
        margin-left: auto;
      }
    }

    .config-grid {
      margin-top: 8px;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .websocket-client {
    .main-card {
      background: #1e1e1e;
      border-color: #333;
    }
  }
}
</style>