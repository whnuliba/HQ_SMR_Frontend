import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import {
  UserOutlined,        // 用户管理
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'SystemUser',
    redirect: '/system/user',
    component: Layout,
    meta: {
      title: '用户管理',
      icon: renderIcon(UserOutlined),
      sort: 1,
      permissions:['role.administrator'], 

    },
    children: [
      {
        path: 'user',
        name: 'system-user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/system/user/index.vue'),
      },
    ],
  },
];

export default routes;
