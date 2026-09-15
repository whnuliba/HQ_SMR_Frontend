import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface RackNodeForm{
        rackNo:string;
        aSide:string;
        aSideCount:number;
        aSideStartIndex:number;
        bSideStartIndex:number;
        bSide:string;
        bSideCount:number;
        ip:string;
        port:number;
} 
        
export interface RackData {
   id :string;
  createTime: Date;
  createUser : string;
  lastModifyTime: Date;
  lastModifyUser: string;
  status:number;
  rackNo: string;
  rackSide: string;
  enable: number;
  inductive: number;
  ip:  string;
  port : number;
  aSideQty: number;
  bSideQty: number;
}

export const columns: BasicColumn<RackData>[] = [

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
    title: 'A面数量',
    key: 'aSideQty',
  },
    {
    title: 'B面数量',
    key: 'bSideQty',
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
