import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface UserData {
  id: string;
  username: string;
  password?: string;
  realName: string;
  workNo?: string;
  permissions?: string;
  status?: number;
  createTime?: string;
  createUser?: string;
  lastModifyTime?: string;
  lastModifyUser?: string;
}

// 权限选项
export const permissionOptions = [
  { label: '管理员', value: 'role.administrator' },
  { label: '生产', value: 'role.production' },
  { label: '用户', value: 'user' },
];

// 状态映射
export const statusMap: Record<number, string> = {
  0: '正常',
  1: '禁用',
};

// 状态标签颜色
export const statusTagType: Record<number, string> = {
  0: 'success',
  1: 'error',
};

// 权限映射
export const permissionMap: Record<string, string> = {
  'role.administrator': '管理员',
  'role.production': '生产',
  'user': '用户',
};

// 渲染权限标签
function renderPermissions(permissions: string | undefined) {
  if (!permissions) return '–';
  const permList = permissions.split(',');
  return permList
    .map((perm) => permissionMap[perm] || perm)
    .join(', ');
}

export const columns: BasicColumn<UserData>[] = [
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: '真实姓名',
    key: 'realName',
    width: 120,
  },
  {
    title: '工号',
    key: 'workNo',
    width: 120,
  },
  {
    title: '权限',
    key: 'permissions',
    width: 180,
    customRender: ({ text }) => renderPermissions(text),
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    customRender: ({ text }) => {
      if (text === undefined || text === null) return h('span', '–');
      return h(
        NTag,
        {
          type: statusTagType[text] || 'default',
          size: 'small',
        },
        () => statusMap[text] || '未知'
      );
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
  {
    title: '创建人',
    key: 'createUser',
    width: 120,
  },
];
