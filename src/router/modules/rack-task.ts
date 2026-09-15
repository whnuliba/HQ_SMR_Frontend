import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  ProfileOutlined,         // 货架任务
  ClockCircleOutlined,     // 历史任务
  StopOutlined,            // 任务取消记录
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/smr',
    name: 'SMR',
    redirect: '/smr/task',
    component: Layout,
    meta: {
      title: '任务信息',
      icon: renderIcon(ProfileOutlined ),
      sort: 2,
    },
    children: [
      {
        path: 'task',
        name: 'task',
        meta: {
          title: '货架任务',
        },
        component: () => import('@/views/smr/task/index.vue'),
      }
    ],
  },

    {
    path: '/smr',
    name: 'task-his',
    redirect: '/smr/taskhis',
    component: Layout,
    meta: {
      title: '历史任务',
      icon: renderIcon(ClockCircleOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'taskhis',
        name: 'taskhis',
        meta: {
          title: '历史任务',
        },
        component: () => import('@/views/smr/taskhis/index.vue'),
      }
    ],
  },

    {
    path: '/smr',
    name: 'task-cancel',
    redirect: '/smr/taskcancel',
    component: Layout,
    meta: {
      title: '任务取消记录',
      icon: renderIcon(StopOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'taskcancel',
        name: 'taskcancel',
        meta: {
          title: '任务取消记录',
        },
        component: () => import('@/views/smr/taskcancel/index.vue'),
      }
    ],
  },  
];

export default routes;
