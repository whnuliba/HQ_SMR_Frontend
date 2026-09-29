import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import {
  ArrowUpOutlined,        // 上架
  ArrowDownOutlined,       // 下架
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/smr/wmsops',
    name: 'SMR-WmsOps',
    redirect: '/smr/wmsops/putway',
    component: Layout,
    meta: {
      title: 'WMS操作',
      icon: renderIcon(ArrowUpOutlined),
      sort: 4,
    },
    children: [
      {
        path: 'putway',
        name: 'putway',
        meta: {
          title: '上架测试',
        },
        component: () => import('@/views/smr/wmsops/putway/index.vue'),
      },
      {
        path: 'down',
        name: 'down',
        meta: {
          title: '下架测试',
        },
        component: () => import('@/views/smr/wmsops/down/index.vue'),
      },
    ],
  },
];

export default routes;
