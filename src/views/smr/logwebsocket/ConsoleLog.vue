<!-- components/ConsoleLog.vue -->

<template>
  <div class="console-container">
    <!-- 控制台工具栏 -->
    <div class="console-toolbar">
      <div class="toolbar-left">
        <n-space size="small">
          <n-button size="small" quaternary @click="handleClear">
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
            清空
          </n-button>
          <n-button size="small" quaternary @click="handlePause">
            <template #icon>
              <n-icon><PauseOutline v-if="!isPaused" /><PlayOutline v-else /></n-icon>
            </template>
            {{ isPaused ? '继续' : '暂停' }}
          </n-button>
          <n-button size="small" quaternary @click="handleExport">
            <template #icon>
              <n-icon><DownloadOutline /></n-icon>
            </template>
            导出
          </n-button>
        </n-space>
      </div>
      <div class="toolbar-right">
        <n-space size="small">
          <n-tag size="small" type="info">{{ logCount }} 条</n-tag>
          <n-tag size="small" :type="isConnected ? 'success' : 'default'">
            {{ isConnected ? '● 已连接' : '○ 未连接' }}
          </n-tag>
          <n-button size="small" quaternary @click="scrollToBottom">
            <template #icon>
              <n-icon><ArrowDownOutline /></n-icon>
            </template>
            底部
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 控制台主体（Jenkins 风格） -->
    <div class="console-body" ref="consoleBodyRef">
      <div 
        v-for="log in logs" 
        :key="log.id" 
        class="console-line"
        :class="getLogLevelClass(log.level)"
      >
        <span class="console-time">{{ formatTime(log.timestamp) }}</span>
        <span class="console-level">{{ getLogLevelIcon(log.level) }}</span>
        <span class="console-source">[{{ log.source }}]</span>
        <span class="console-message">{{ log.message }}</span>
      </div>
      
      <div v-if="logs.length === 0" class="console-empty">
        <n-empty description="暂无日志" size="small" />
      </div>
    </div>

    <!-- 控制台底部状态栏 -->
    <div class="console-footer">
      <span class="footer-info">
        <span class="footer-dot" :class="{ connected: isConnected }"></span>
        {{ statusText }}
      </span>
      <span class="footer-info">
        <span class="footer-dot"></span>
        连接 ID: {{ connectionId || '-' }}
      </span>
      <span class="footer-info">
        <span class="footer-dot"></span>
        用户: {{ userId || '-' }}
      </span>
      <span class="footer-info">
        <span class="footer-dot"></span>
        日志: {{ logCount }} 条
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import {
  NButton,
  NSpace,
  NIcon,
  NTag,
  NEmpty
} from 'naive-ui';
import {
  TrashOutline,
  PauseOutline,
  PlayOutline,
  DownloadOutline,
  ArrowDownOutline
} from '@vicons/ionicons5';
import { ConsoleLevel, type ConsoleLogEntry } from '@/types/websocket';

// ============================================================
// Props
// ============================================================

interface Props {
  logs: ConsoleLogEntry[];
  logCount: number;
  isConnected: boolean;
  connectionId: string;
  userId: string;
  statusText: string;
  isPaused?: boolean;
  getLogLevelClass: (level: ConsoleLevel) => string;
  getLogLevelIcon: (level: ConsoleLevel) => string;
  formatTime: (date: Date) => string;
}

const props = withDefaults(defineProps<Props>(), {
  isPaused: false
});

// ============================================================
// Emits
// ============================================================

const emit = defineEmits<{
  (e: 'clear'): void;
  (e: 'pause'): void;
  (e: 'export'): void;
}>();

// ============================================================
// 控制台引用
// ============================================================

const consoleBodyRef = ref<HTMLDivElement>();
const autoScroll = ref(true);

// ============================================================
// 方法
// ============================================================

const handleClear = () => {
  emit('clear');
};

const handlePause = () => {
  emit('pause');
};

const handleExport = () => {
  emit('export');
};

const scrollToBottom = () => {
  if (consoleBodyRef.value) {
    consoleBodyRef.value.scrollTop = consoleBodyRef.value.scrollHeight;
    autoScroll.value = true;
  }
};

// ============================================================
// 监听滚动事件，检测用户是否手动滚动
// ============================================================

const handleScroll = () => {
  if (!consoleBodyRef.value) return;
  const { scrollTop, scrollHeight, clientHeight } = consoleBodyRef.value;
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
  autoScroll.value = isAtBottom;
};

// ============================================================
// 监听日志变化，自动滚动到底部
// ============================================================

watch(
  () => props.logs.length,
  async () => {
    if (autoScroll.value && !props.isPaused) {
      await nextTick();
      scrollToBottom();
    }
  }
);

// ============================================================
// 暴露方法
// ============================================================

defineExpose({
  scrollToBottom
});
</script>

<style scoped lang="scss">
.console-container {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  font-family: 'Consolas', 'Courier New', monospace;

  .console-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #2d2d2d;
    border-bottom: 1px solid #3d3d3d;
    flex-wrap: wrap;
    gap: 8px;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    :deep(.n-button) {
      color: #cccccc;
      font-size: 12px;
      
      &:hover {
        color: #ffffff;
        background: #3d3d3d;
      }
    }

    :deep(.n-tag) {
      font-size: 11px;
      font-family: inherit;
    }
  }

  .console-body {
    height: 400px;
    overflow-y: auto;
    padding: 8px 16px;
    background: #1e1e1e;
    font-size: 13px;
    line-height: 1.8;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: #3d3d3d;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #1e1e1e;
    }

    .console-line {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 1px 0;
      color: #cccccc;
      font-size: 12px;
      line-height: 1.6;
      font-family: 'Consolas', 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);

      &:hover {
        background: rgba(255, 255, 255, 0.03);
      }

      .console-time {
        color: #666666;
        min-width: 80px;
        flex-shrink: 0;
        font-size: 11px;
        user-select: none;
      }

      .console-level {
        min-width: 20px;
        flex-shrink: 0;
        text-align: center;
      }

      .console-source {
        color: #888888;
        min-width: 80px;
        flex-shrink: 0;
        font-size: 11px;
        user-select: none;
      }

      .console-message {
        flex: 1;
        word-break: break-all;
      }

      // 不同级别样式
      &.console-info .console-message {
        color: #a0d8ef;
      }

      &.console-success .console-message {
        color: #7ddf9a;
      }

      &.console-warning .console-message {
        color: #f0c040;
      }

      &.console-error .console-message {
        color: #f07070;
      }

      &.console-debug .console-message {
        color: #888888;
        font-style: italic;
      }

      &.console-system .console-message {
        color: #88b0e0;
      }

      &.console-send .console-message {
        color: #b8a0ff;
      }

      &.console-receive .console-message {
        color: #7ddf9a;
      }
    }

    .console-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #666666;
    }
  }

  .console-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 16px;
    background: #2d2d2d;
    border-top: 1px solid #3d3d3d;
    font-size: 11px;
    color: #888888;
    font-family: inherit;
    flex-wrap: wrap;
    gap: 4px;

    .footer-info {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #666666;
      flex-shrink: 0;

      &.connected {
        background: #4caf50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
      }
    }
  }
}

// 暗色主题适配
:deep(.n-empty) {
  .n-empty__description {
    color: #666666;
  }
}
</style>