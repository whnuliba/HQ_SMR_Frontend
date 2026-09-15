import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface RackRunningLogForm {
  rackNo: string;
  rackSide: string;
  location: string;
  taskId: string;
  ppid: string;
  alarmType: number;
  message: string;
  logLevel: string;
  handleState: number;
}

export interface RackRunningLogData {
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
  message: string;
  logLevel: string;
  handleState: number;
}

// 日志级别映射
export const logLevelMap: Record<string, string> = {
  'INFO': '信息',
  'WARN': '警告',
  'ERROR': '错误',
  'DEBUG': '调试',
};

// 日志级别标签颜色
export const logLevelTagType: Record<string, string> = {
  'INFO': 'info',
  'WARN': 'warning',
  'ERROR': 'error',
  'DEBUG': 'default',
};

export const columns: BasicColumn<RackRunningLogData>[] = [
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
    title: '日志级别',
    key: 'logLevel',
    width: 100,
    render(record) {
      if (!record.logLevel) return h('span', '--');
      return h(
        NTag,
        {
          type: logLevelTagType[record.logLevel] || 'default',
          size: 'small',
        },
        {
          default: () => logLevelMap[record.logLevel] || record.logLevel,
        }
      );
    },
  },
  {
    title: '日志内容',
    key: 'message',
    width: 300,
    ellipsis: true,
  },
  {
    title: '报警类型',
    key: 'alarmType',
    width: 100,
    render(record) {
      if (!record.alarmType) return h('span', '--');
      const alarmMap: Record<number, string> = {
        1: '温度',
        2: '湿度',
        3: '料架异常',
        4: '任务超时',
      };
      return h('span', alarmMap[record.alarmType] || '未知');
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
];