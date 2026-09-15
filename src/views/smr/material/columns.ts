import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface MaterialInfoForm {
  rackId: string;
  rackSide: string;
  taskId: string;
  ppid: string;
  compPn: string;
  description: string;
  qty: number;
  customerPn: string;
  vendorCode: string;
  dateCode: string;
  lotCode: string;
  orgCode: string;
  no09: string;
  gupn: string;
  userId: string;
}

export interface MaterialInfoData {
  id: string;
  createTime: Date;
  createUser: string;
  lastModifyTime: Date;
  lastModifyUser: string;
  status: number;
  operateType: string;
  rackId: string;
  rackSide: string;
  taskId: string;
  lightColor: number;
  outTime: number;
  ppid: string;
  compPn: string;
  description: string;
  qty: number;
  customerPn: string;
  vendorCode: string;
  dateCode: string;
  lotCode: string;
  orgCode: string;
  no09: string;
  gupn: string;
  userId: string;
  sessionId: string;
}

// 亮灯颜色映射
export const lightColorMap: Record<number, string> = {
  1: '红',
  2: '淡白',
  3: '绿',
  4: '蓝',
  5: '黄绿',
  6: '紫',
  7: '黄',
  8: '浅蓝',
  9: '浅黄'
};

// 颜色标签类型映射
export const lightColorTagType: Record<number, string> = {
  1: 'error',
  2: 'default',
  3: 'success',
  4: 'info',
  5: 'warning',
  6: 'primary',
  7: 'warning',
  8: 'info',
  9: 'warning'
};

export const columns: BasicColumn<MaterialInfoData>[] = [
  {
    title: '任务ID',
    key: 'taskId',
    width: 150,
  },
  {
    title: '料架ID',
    key: 'rackId',
    width: 130,
  },
  {
    title: '面别',
    key: 'rackSide',
    width: 80,
  },
  {
    title: 'PPID',
    key: 'ppid',
    width: 120,
  },
  {
    title: '产品料号',
    key: 'compPn',
    width: 140,
  },
  {
    title: '物料描述',
    key: 'description',
    width: 200,
    ellipsis: true,
  },
  {
    title: '数量',
    key: 'qty',
    width: 80,
  },
  {
    title: '客户料号',
    key: 'customerPn',
    width: 140,
  },
  {
    title: '供应商',
    key: 'vendorCode',
    width: 120,
  },
  {
    title: '亮灯颜色',
    key: 'lightColor',
    width: 100,
    render(record) {
      if (!record.lightColor) return h('span', '--');
      return h(
        NTag,
        {
          type: lightColorTagType[record.lightColor] || 'default',
          size: 'small',
        },
        {
          default: () => lightColorMap[record.lightColor] || '未知',
        }
      );
    },
  },
  {
    title: '操作类型',
    key: 'operateType',
    width: 120,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
];