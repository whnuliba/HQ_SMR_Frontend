import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  MessageOutlined,
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dispatchMessage',
    name: 'dispatch-message',
    redirect: '/smr/dispatchMessage',
    component: Layout,
    meta: {
      title: '接口日志',
      icon: renderIcon(MessageOutlined),
      sort: 10,
    },
    children: [
      {
        path: 'dispatch-message',
        name: 'dispatchMessage',
        meta: {
          title: '接口日志',
          icon: renderIcon(MessageOutlined),
          permissions: ['role.administrator', 'role.production', 'user'],
        },
        component: () => import('@/views/smr/dispatchMessage/index.vue'),
      },
    ],
  },
];

export default routes;
