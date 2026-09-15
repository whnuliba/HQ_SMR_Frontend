import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  DesktopOutlined  ,          // 设备操作
} from '@vicons/antd';import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
 {
    path: '/device',
    name: 'device',
    redirect: '/smr/deviceCtrlForm',
    component: Layout,
    meta: {
      title: '设备操作',
      icon: renderIcon(DesktopOutlined  ),
      sort: 2,
    },
    children: [
      {
        path: 'deviceCtrlForm',
        name: 'deviceCtrlForm',
        meta: {
          title: '设备操作',
        },
        component: () => import('@/views/smr/deviceCtrlForm/index.vue'),
      }
    ],
  },

];

export default routes;
