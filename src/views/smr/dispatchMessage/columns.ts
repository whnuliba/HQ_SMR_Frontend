import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface DispatchMessageData {
  id: string;
  operateType?: string;
  rackId?: string;
  rackSide?: string;
  taskId?: string;
  ppId: string;
  timestamp?: string;
  message: string;
  requestId?: string;
  respMessage?: string;
  ioStatus?: string;
  bizStatus?: string;
  status?: number;
  createTime?: string;
  createUser?: string;
}

// IO状态映射
export const ioStatusMap: Record<string, string> = {
  I: 'WMS→WCS',
  O: 'WCS→WMS',
  '1': 'WMS→WCS',
  '0': 'WCS→WMS',
};

// IO状态标签颜色
export const ioStatusTagType: Record<string, string> = {
  I: 'info',
  O: 'success',
  '1': 'info',
  '0': 'success',
};

// 业务状态映射
export const bizStatusMap: Record<string, string> = {
  '1': '上架',
  '0': '下架',
};

// 业务状态标签颜色
export const bizStatusTagType: Record<string, string> = {
  '1': 'success',
  '0': 'warning',
};

// 状态映射
export const statusMap: Record<number, string> = {
  0: '创建',
  1: '已发送',
};

// 状态标签颜色
export const statusTagType: Record<number, string> = {
  0: 'default',
  1: 'success',
};

export const columns: BasicColumn<DispatchMessageData>[] = [
  {
    title: '方向',
    key: 'ioStatus',
    width: 100,
    customRender: ({ text }) => {
      if (!text) return h('span', '–');
      return h(
        NTag,
        { type: ioStatusTagType[text] || 'default', size: 'small' },
        () => ioStatusMap[text] || text
      );
    },
  },
  {
    title: '业务状态',
    key: 'bizStatus',
    width: 100,
    customRender: ({ text }) => {
      if (!text) return h('span', '–');
      return h(
        NTag,
        { type: bizStatusTagType[text] || 'default', size: 'small' },
        () => bizStatusMap[text] || text
      );
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    customRender: ({ text }) => {
      if (text === undefined || text === null) return h('span', '–');
      return h(
        NTag,
        { type: statusTagType[text] || 'default', size: 'small' },
        () => statusMap[text] || text
      );
    },
  },
  {
    title: '操作类型',
    key: 'operateType',
    width: 120,
  },
  {
    title: '料架编号',
    key: 'rackId',
    width: 120,
  },
  {
    title: '面别',
    key: 'rackSide',
    width: 80,
  },
  {
    title: '任务ID',
    key: 'taskId',
    width: 180,
  },
  {
    title: 'PPID',
    key: 'ppId',
    width: 180,
    ellipsis: true,
  },
  {
    title: '请求ID',
    key: 'requestId',
    width: 150,
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
];

export const hisColumns: BasicColumn<DispatchMessageData>[] = [
  ...columns,
  {
    title: '归档时间',
    key: 'lastModifyTime',
    width: 160,
  },
];
