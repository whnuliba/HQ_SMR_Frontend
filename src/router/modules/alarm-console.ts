import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  ConsoleSqlOutlined,
        // 运行日志
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [    // ============================================================
  // WebSocket 控制台（新增）
  // ============================================================
  {
    path: '/logwebsocket',
    name: 'websocket-console',
    redirect: '/smr/logwebsocket',
    component: Layout,
    meta: {
      title: '运行日志',
      icon: renderIcon(ConsoleSqlOutlined),
      sort: 3,  // 调整排序，放在后面
    },
    children: [
      {
        path: 'logwebsocket-console',
        name: 'websocketConsole',
        meta: {
          title: '运行日志',
          icon: renderIcon(ConsoleSqlOutlined),
        },
        component: () => import('@/views/smr/logwebsocket/WebSocketClient.vue'),
      }
    ],
  },
]
export default routes;