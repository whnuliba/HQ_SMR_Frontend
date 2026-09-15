import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
    
export interface LocationData {
   id :string;
  createTime: Date;
  createUser : string;
  lastModifyTime: Date;
  lastModifyUser: string;
  status:number;
  rackNo: string;
  rackSide: string;
  loading: number;
  light: number;
  ip:  string;
  port : number;
  ppid:  string;
}

export const columns: BasicColumn<LocationData>[] = [

  {
    title: '货架号',
    key: 'rackNo',
  },
  {
    title: 'IP地址',
    key: 'ip',
  },
  {
    title: '端口',
    key: 'port',
  },
  {
    title: '储位',
    key: 'location',
  },
  {
    title: '载货状态',
    key: 'loading',
  },
  {
    title: 'PPID',
    key: 'ppid',
  },
  // {
  //   title: '任务类型',
  //   key: 'taskType',
  //   render(record) {
  //     return h(
  //       NTag,
  //       {
  //         type:'default'
  //       },
  //       {
  //         default: () => taskType[record.taskType],
  //       }
  //     );
  //   },
 // },
  {
    title: '创建时间',
    key: 'createTime',
  },
];
