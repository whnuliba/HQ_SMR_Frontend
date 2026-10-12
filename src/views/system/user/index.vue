<template>
  <n-card title="用户管理" :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row: UserData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1200"
      :striped="true"
    >
      <template #tableTitle>
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            新增用户
          </n-button>
        </n-space>
      </template>
    </BasicTable>

    <!-- 新增/编辑用户弹窗 -->
    <n-modal v-model:show="showModal" preset="dialog" :title="modalTitle">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formData.username" :disabled="isEdit" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="真实姓名" path="realName">
          <n-input v-model:value="formData.realName" placeholder="请输入真实姓名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="formData.password" type="password" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item label="工号" path="workNo">
          <n-input v-model:value="formData.workNo" placeholder="请输入工号" />
        </n-form-item>
        <n-form-item label="权限" path="permissions">
          <n-checkbox-group v-model:value="formData.permissions">
            <n-space>
              <n-checkbox value="role.administrator">管理员</n-checkbox>
              <n-checkbox value="role.production">生产</n-checkbox>
              <n-checkbox value="user">用户</n-checkbox>
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item v-if="isEdit" label="状态" path="status">
          <n-radio-group v-model:value="formData.status">
            <n-radio :value="0">正常</n-radio>
            <n-radio :value="1">禁用</n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" :loading="loading" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 修改密码弹窗 -->
    <n-modal v-model:show="showPwdModal" preset="dialog" title="修改密码">
      <n-form
        ref="pwdFormRef"
        :model="pwdFormData"
        :rules="pwdRules"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="用户名">
          <n-input v-model:value="pwdFormData.username" disabled />
        </n-form-item>
        <n-form-item label="新密码" path="Password">
          <n-input
            v-model:value="pwdFormData.Password"
            type="password"
            show-password-on="click"
            placeholder="请输入新密码"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="newPassword">
          <n-input
            v-model:value="pwdFormData.newPassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入新密码"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showPwdModal = false">取消</n-button>
          <n-button type="primary" :loading="pwdLoading" @click="handlePwdSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { PlusOutlined } from '@vicons/antd';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns, UserData } from './columns';
  import { getUserList, addUser, updateUser, deleteUser, updateUserPwd } from '@/api/system/userManagement';

  const message = useMessage();
  const actionRef = ref();
  const loading = ref(false);
  const showModal = ref(false);
  const isEdit = ref(false);
  const modalTitle = ref('新增用户');
  const currentRecord = ref<UserData | null>(null);

  // 密码修改相关
  const showPwdModal = ref(false);
  const pwdLoading = ref(false);
  const pwdFormRef = ref();

  const formData = reactive({
    id: '',
    username: '',
    realName: '',
    password: '',
    workNo: '',
    permissions: [] as string[],
    status: 0,
  });

  const pwdFormData = reactive({
    username: '',
    Password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const rules = {
    username: { required: true, message: '请输入用户名', trigger: 'blur' },
    realName: { required: true, message: '请输入真实姓名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
  };

  const pwdRules = {
   Password: [
      { required: true, message: '请输入原密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      {
        validator: (_rule: any, value: string) => {
          if (value !== String(pwdFormData.Password)) {
        
            return new Error('两次输入密码不一致');
          }
          return true;
        },
        trigger: 'blur',
      },
    ],
  };

  const loadDataTable = async (res: any) => {
    return await getUserList(res);
  };

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  function handleAdd() {
    isEdit.value = false;
    modalTitle.value = '新增用户';
    Object.assign(formData, {
      id: '',
      username: '',
      realName: '',
      password: '',
      workNo: '',
      permissions: [],
      status: 0,
    });
    showModal.value = true;
  }

  function handleEdit(record: UserData) {
    isEdit.value = true;
    modalTitle.value = '编辑用户';
    currentRecord.value = record;
    Object.assign(formData, {
      id: record.id,
      username: record.username,
      realName: record.realName,
      password: '',
      workNo: record.workNo || '',
      permissions: record.permissions ? record.permissions.split(',') : [],
      status: record.status ?? 0,
    });
    showModal.value = true;
  }

  function handleDelete(record: UserData) {
    deleteUser({ id: record.id })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('删除成功');
          actionRef.value?.reload();
        } else {
          message.error(res.message || '删除失败');
        }
      })
      .catch(() => {
        message.error('删除失败');
      });
  }

  function handleChangePwd(record: UserData) {
    currentRecord.value = record;
    Object.assign(pwdFormData, {
      username: record.username,
      newPassword: '',
      confirmPassword: '',
    });
    showPwdModal.value = true;
  }

  async function handleSubmit() {
    if (!formData.username || !formData.realName) {
      message.warning('请填写必填项');
      return;
    }

    if (!isEdit.value && !formData.password) {
      message.warning('请输入密码');
      return;
    }

    loading.value = true;
    try {
      const data: any = {
        id: formData.id,
        username: formData.username,
        realName: formData.realName,
        workNo: formData.workNo,
        permissions: formData.permissions.join(','),
        status: formData.status,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      const res = isEdit.value
        ? await updateUser({ data: data })
        : await addUser({ data });

      if (res.code === 200) {
        message.success(isEdit.value ? '修改成功' : '新增成功');
        showModal.value = false;
        actionRef.value?.reload();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      loading.value = false;
    }
  }

  async function handlePwdSubmit() {
    try {
      await pwdFormRef.value?.validate();
    } catch {
      return;
    }

    if (pwdFormData.newPassword !== pwdFormData.confirmPassword) {
      message.error('两次输入密码不一致');
      return;
    }

    pwdLoading.value = true;
    try {
      const res: any = await updateUserPwd({
        userName: pwdFormData.username,
        newPassword: pwdFormData.newPassword,
      });

      if (res.code === 200) {
        message.success('密码修改成功');
        showPwdModal.value = false;
      } else {
        message.error(res.message || '密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败');
    } finally {
      pwdLoading.value = false;
    }
  }

  // 操作列 - 参考 rack/index.vue
  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: UserData) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: () => handleEdit(record),
          },
          // {
          //   label: '改密',
          //   onClick: () => handleChangePwd(record),
          // },
          // {
          //   label: '删除',
          //   onClick: () => handleDelete(record),
          // },
        ],
      });
    },
  });
</script>

<style lang="less" scoped></style>
