import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface RackAlarmForm {
  rackNo: string;
  rackSide: string;
  location: string;
  taskId: string;
  ppid: string;
  alarmType: number;
  message: string;
  locationType: number;
  handleState: number;
}

export interface RackAlarmData {
  id: string;
  createTime: Date;
  createUser: string;
  lastModifyTime: Date;
  lastModifyUser: string;
  status: number;
  rackNo: string;
  rackSide: string;
  location: string;
  taskId: string;
  ppid: string;
  alarmType: number;
  locationType: number;
  message: string;
  handleState: number;
}

// 报警类型映射
export const alarmTypeMap: Record<number, string> = {
  1: '上架错误',
  0: '下架错误',
  3: '料架异常',
  4: '任务超时',
  5: 'PPID重复',
  6: '通讯异常',
  7: '其他报警',
};

export const locationTypeMap: Record<number, string> = {
  0: '单储位报警',
  1: '多储位报警',
  2: '单面报警',
};


export const locationTypeTagType: Record<number, string> = {
  0: 'error',
  1: 'warning',
  2: 'error',
  3: 'warning',
  4: 'info',
  5: 'error',
  6: 'error',
  7: 'error',
  8: 'default',
};

// 报警类型标签颜色
export const alarmTypeTagType: Record<number, string> = {
  0: 'error',
  1: 'warning',
  2: 'error',
  3: 'warning',
  4: 'info',
  5: 'error',
  6: 'error',
  7: 'error',
  8: 'default',
};

// 处理状态映射
export const handleStateMap: Record<number, string> = {
  0: '待处理',
  1: '已处理',
  2: '已处理',
  3: '已忽略',
};

// 处理状态标签颜色
export const handleStateTagType: Record<number, string> = {
  0: 'error',
  1: 'warning',
  2: 'success',
  3: 'default',
};

export const columns: BasicColumn<RackAlarmData>[] = [
  {
    title: '料架号',
    key: 'rackNo',
    width: 130,
  },
  {
    title: '面别',
    key: 'rackSide',
    width: 80,
  },
  {
    title: '库位',
    key: 'location',
    width: 100,
  },
  {
    title: '任务ID',
    key: 'taskId',
    width: 150,
  },
  {
    title: 'PPID',
    key: 'ppid',
    width: 120,
  },
  {
    title: '报警类型',
    key: 'alarmType',
    width: 120,
    render(record) {
      if (record.alarmType==null || record.alarmType==undefined) return h('span', '--');
      return h(
        NTag,
        {
          type: alarmTypeTagType[record.alarmType] || 'default',
          size: 'small',
        },
        {
          default: () => alarmTypeMap[record.alarmType] || '未知',
        }
      );
    },
  },
    {
    title: '报警位置',
    key: 'locationType',
    width: 120,
    render(record) {
      if (record.alarmType==null || record.alarmType==undefined) return h('span', '--');
      return h(
        NTag,
        {
          type: locationTypeTagType[record.locationType] || 'default',
          size: 'small',
        },
        {
          default: () => locationTypeMap[record.locationType] || '未知',
        }
      );
    },
  },
  {
    title: '报警消息',
    key: 'message',
    width: 250,
    ellipsis: true,
  },
  {
    title: '处理状态',
    key: 'handleState',
    width: 100,
    render(record) {
      if (record.handleState === undefined || record.handleState === null) return h('span', '--');
      return h(
        NTag,
        {
          type: handleStateTagType[record.handleState] || 'default',
          size: 'small',
        },
        {
          default: () => handleStateMap[record.handleState] || '未知',
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
];