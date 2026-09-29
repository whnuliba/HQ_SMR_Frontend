import { FormSchema } from '@/components/Form/index';

// 上架表单配置
export const putwayFormSchema: FormSchema[] = [
  {
    field: 'rackCmd',
    component: 'NSelect',
    label: '命令类型',
    required: true,
    defaultValue: 'Up',
    componentProps: {
      placeholder: '请选择命令类型',
      options: [
        { label: '请求上架命令', value: 'Up' },
        { label: '请求上架结束', value: 'Up_end' },
      ],
    },
  },
  {
    field: 'rackId',
    component: 'NInput',
    label: '料架编号',
    required: true,
    componentProps: {
      placeholder: '请输入料架编号',
    },
  },
  {
    field: 'rackSide',
    component: 'NSelect',
    label: '面别',
    componentProps: {
      placeholder: '请选择面别',
      options: [
        { label: 'A面', value: 'A' },
        { label: 'B面', value: 'B' },
      ],
    },
  },
  {
    field: 'ppid',
    component: 'NInput',
    label: 'PPID',
    componentProps: {
      placeholder: '请输入PPID',
    },
  },
  {
    field: 'compPn',
    component: 'NInput',
    label: '产品料号',
    componentProps: {
      placeholder: '请输入产品料号',
    },
  },
  {
    field: 'description',
    component: 'NInput',
    label: '物料描述',
    componentProps: {
      placeholder: '请输入物料描述',
    },
  },
  {
    field: 'qty',
    component: 'NInputNumber',
    label: '数量',
    componentProps: {
      placeholder: '请输入数量',
      min: 0,
    },
  },
  {
    field: 'customerPn',
    component: 'NInput',
    label: '客户料号',
    componentProps: {
      placeholder: '请输入客户料号',
    },
  },
  {
    field: 'vendorCode',
    component: 'NInput',
    label: '供应商',
    componentProps: {
      placeholder: '请输入供应商代码',
    },
  },
  {
    field: 'dateCode',
    component: 'NInput',
    label: 'Date Code',
    componentProps: {
      placeholder: '请输入Date Code',
    },
  },
  {
    field: 'lotCode',
    component: 'NInput',
    label: 'Lot Code',
    componentProps: {
      placeholder: '请输入Lot Code',
    },
  },
  {
    field: 'orgCode',
    component: 'NInput',
    label: '组织',
    componentProps: {
      placeholder: '请输入组织代码',
    },
  },
  {
    field: 'lightColor',
    component: 'NSelect',
    label: '亮灯颜色',
    componentProps: {
      placeholder: '请选择亮灯颜色',
      options: [
        { label: '红', value: 1 },
        { label: '淡白', value: 2 },
        { label: '绿', value: 3 },
        { label: '蓝', value: 4 },
        { label: '黄绿', value: 5 },
        { label: '紫', value: 6 },
        { label: '黄', value: 7 },
        { label: '浅蓝', value: 8 },
        { label: '浅黄', value: 9 },
      ],
    },
  },
  {
    field: 'outTime',
    component: 'NInputNumber',
    label: '超时时间(秒)',
    componentProps: {
      placeholder: '请输入超时时间',
      min: 0,
    },
  },
  {
    field: 'userId',
    component: 'NInput',
    label: '用户ID',
    componentProps: {
      placeholder: '请输入用户ID',
    },
  },
];

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
  9: '浅黄',
};

// 亮灯颜色标签类型
export const lightColorTagType: Record<number, string> = {
  1: 'error',
  2: 'default',
  3: 'success',
  4: 'info',
  5: 'warning',
  6: 'warning',
  7: 'warning',
  8: 'info',
  9: 'warning',
};
