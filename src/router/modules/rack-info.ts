import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { 
  TableOutlined,
  FileOutlined,
  AlertOutlined,
  FileTextOutlined,
  ConsoleSqlOutlined,
        // 运行日志
} from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
 {
    path: '/rack',
    name: 'rackinfo',
    redirect: '/smr/rack',
    component: Layout,
    meta: {
      title: '料架信息',
      icon: renderIcon(TableOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'rack',
        name: 'rack',
        meta: {
          title: '货架信息',
        },
        component: () => import('@/views/smr/rack/index.vue'),
      }
    ],
  },

 {
    path: '/material',
    name: 'rack-material',
    redirect: '/smr/material',
    component: Layout,
    meta: {
      title: '物料信息',
      icon: renderIcon(FileOutlined),
      sort: 2,
    },
    children: [
    {
        path: 'material-info',
        name: 'materialInfo',
        meta: {
          title: '物料信息',
          icon: renderIcon(FileOutlined),
        },
        component: () => import('@/views/smr/material/index.vue'),
      },
    ],
  },

 {
    path: '/rackAlarm',
    name: 'rack-alarm',
    redirect: '/smr/rackAlarm',
    component: Layout,
    meta: {
      title: '货架报警',
      icon: renderIcon(AlertOutlined ),
      sort: 2,
    },
    children: [
   {
        path: 'rack-alarm',
        name: 'rackAlarm',
        meta: {
          title: '货架报警',
          icon: renderIcon(AlertOutlined ),
        },
        component: () => import('@/views/smr/rackAlarm/index.vue'),
      },
    ],
  },
      
    {
    path: '/rackRunningLog',
    name: 'rackRunningLogInfo',
    redirect: '/smr/rackRunningLog',
    component: Layout,
    meta: {
      title: '货架报警',
      icon: renderIcon(FileTextOutlined ),
      sort: 2,
    },
    children: [
 {
        path: 'rack-running-log',
        name: 'rackRunningLog',
        meta: {
          title: '运行日志',
            icon: renderIcon(FileTextOutlined ),
        },
        component: () => import('@/views/smr/rackRunningLog/index.vue'),
      }
    ],
  },
];

export default routes;
