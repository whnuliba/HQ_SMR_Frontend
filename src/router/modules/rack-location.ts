import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  AppstoreOutlined,        // 储位信息
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/location',
    name: 'location',
    redirect: '/smr/location',
    component: Layout,
    meta: {
      title: '料架信息',
      icon: renderIcon(AppstoreOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'location',
        name: 'racklocation',
        meta: {
          title: '储位信息',
        },
        component: () => import('@/views/smr/location/index.vue'),
      }
    ],
  },
];

export default routes;
