import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface VMaterialForm {
  ppid: string;
  rackId: string;
  location: number;
  startCreateTime: string;
  endCreateTime: string;
  startUpTime: string;
  endUpTime: string;
}

export interface VMaterialData {
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
  timestamp: Date;
  sessionId: string;
  location: number;
  loading: number;
  upTime: Date;
  startCreateTime: Date;
  endCreateTime: Date;
  startUpTime: Date;
  endUpTime: Date;
}

export const columns: BasicColumn<VMaterialData>[] = [
  {
    title: 'PPID',
    key: 'ppid',
    width: 180,
    ellipsis: true,
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
    title: '储位号',
    key: 'location',
    width: 80,
  },
  {
    title: '任务ID',
    key: 'taskId',
    width: 150,
    ellipsis: true,
  },
  {
    title: '产品料号',
    key: 'compPn',
    width: 120,
    ellipsis: true,
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
    width: 120,
    ellipsis: true,
  },
  {
    title: '供应商',
    key: 'vendorCode',
    width: 120,
    ellipsis: true,
  },
  {
    title: 'Date Code',
    key: 'dateCode',
    width: 100,
  },
  {
    title: 'Lot Code',
    key: 'lotCode',
    width: 100,
  },
  {
    title: '组织',
    key: 'orgCode',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
  {
    title: '上架时间',
    key: 'upTime',
    width: 160,
  },
];
