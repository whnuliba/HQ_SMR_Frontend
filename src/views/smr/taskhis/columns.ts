import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
export interface RackTaskData {
   id :string;
  createTime: Date;
  createUser : string;
  lastModifyTime: Date;
  lastModifyUser: string;
  status:number;
  rackNo: string;
  taskState:number;
  ppid : string;
  location:number;
  taskType:number;
  taskDescription: string;
  materialNo: string;
  materialName: string;
  locations: string;
  rackSide: string;

}

const taskState = {
  0: '上架等待',
  1: '上架完成',
  2: '下架等待',
  3: '下架完成'
};

const taskType = {
  0: '入库',
  1: '出库',
};

export const columns: BasicColumn<RackTaskData>[] = [
  {
    title: '任务号',
    key: 'id',
  },
  {
    title: '货架号',
    key: 'rackNo',
  },
  {
    title: '任务状态',
    key: 'taskState',
    render(record) {
      return h(
        NTag,
        {
          type: 'info', //record.taskState === 'male' ? 'info' : 'error',
        },
        {
          default: () => taskState[record.taskState],
        }
      );
    },
  },
  {
    title: 'ppid',
    key: 'ppid',
    width: 220,
  },
  {
    title: '储位',
    key: 'location',
  },
  {
    title: '任务类型',
    key: 'taskType',
    render(record) {
      return h(
        NTag,
        {
          type:'default'
        },
        {
          default: () => taskType[record.taskType],
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
];
