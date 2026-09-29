import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import {
  DatabaseOutlined,        // 物料统计
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/smr',
    name: 'SMR-material',
    redirect: '/smr/vmaterial',
    component: Layout,
    meta: {
      title: '物料统计',
      icon: renderIcon(DatabaseOutlined),
      sort: 3,
    },
    children: [
      {
        path: 'vmaterial',
        name: 'vmaterial',
        meta: {
          title: '物料统计',
        },
        component: () => import('@/views/smr/vmaterial/index.vue'),
      }
    ],
  },
];

export default routes;
