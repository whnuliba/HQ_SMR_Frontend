<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <n-tabs type="line" animated>
        <n-tab-pane name="info" tab="用户信息">
          <BasicForm @register="registerForm" />
        </n-tab-pane>
        <n-tab-pane name="password" tab="修改密码">
          <BasicForm @register="registerPwdForm" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { useMessage } from 'naive-ui';
  import { updateUserPwd } from '@/api/system/userManagement';
  import type { UserData } from './columns';

  const message = useMessage();
  let currentRecord: UserData | null = null;

  const schemas: FormSchema[] = [
    {
      field: 'username',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
        disabled: true,
      },
    },
    {
      field: 'realName',
      component: 'NInput',
      label: '真实姓名',
      componentProps: {
        placeholder: '请输入真实姓名',
      },
      rules: [{ required: true, message: '请输入真实姓名', trigger: ['blur'] }],
    },
    {
      field: 'workNo',
      component: 'NInput',
      label: '工号',
      componentProps: {
        placeholder: '请输入工号',
      },
    },
    {
      field: 'permissions',
      component: 'NSelect',
      label: '权限',
      componentProps: {
        placeholder: '请选择权限',
        multiple: true,
        options: [
          { label: '管理员', value: 'role.administrator' },
          { label: '生产', value: 'role.production' },
          { label: '用户', value: 'user' },
        ],
      },
      rules: [{ required: true, message: '请选择权限', trigger: 'change', type: 'array', min: 1 }],
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: 0 },
          { label: '禁用', value: 1 },
        ],
      },
      rules: [{ required: true, message: '请选择状态', trigger: 'change' }],
    },
  ];

  const pwdSchemas: FormSchema[] = [
    {
      field: 'userName',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'oldPassword',
      component: 'NInput',
      label: '原密码',
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: '请输入原密码',
      },
      rules: [{ required: true, message: '请输入原密码', trigger: ['blur'] }],
    },
    {
      field: 'newPassword',
      component: 'NInput',
      label: '新密码',
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: '请输入新密码',
      },
      rules: [
        { required: true, message: '请输入新密码', trigger: ['blur'] },
        { type: 'string', min: 6, message: '密码至少6位', trigger: ['blur'] },
      ],
    },
    {
      field: 'confirmPassword',
      component: 'NInput',
      label: '确认密码',
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: '请再次输入新密码',
      },
      rules: [
        { required: true, message: '请再次输入新密码', trigger: ['blur'] },
        {
          validator: (rule, value) => {
            const pwdForm = formValues.value;
            if (value !== pwdForm?.newPassword) {
              return new Error('两次输入密码不一致');
            }
            return true;
          },
          trigger: 'blur',
        },
      ],
    },
  ];

  const [registerForm, { submit: submitForm, setFieldsValue: setFieldsValueInfo, resetFields: resetInfo }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [registerPwdForm, { submit: submitPwd, setFieldsValue: setFieldsValuePwd, resetFields: resetPwd }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存密码',
    showActionButtonGroup: false,
    schemas: pwdSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑用户',
    subBtuText: '保存',
  });

  const formValues = ref<Recordable>({});

  function showModal(record: UserData) {
    currentRecord = record;
    setFieldsValueInfo({
      username: record.username,
      realName: record.realName,
      workNo: record.workNo,
      permissions: record.permissions ? record.permissions.split(',') : [],
      status: record.status ?? 0,
    });
    setFieldsValuePwd({
      userName: record.username,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    openModal();
  }

  async function okModal() {
    // 获取当前激活的 tab，这里简化处理，默认提交表单
    message.info('请在对应标签页中提交表单');
    setSubLoading(false);
  }

  // 提交用户信息
  async function submitInfo() {
    const formRes = await submitForm();
    if (formRes) {
      try {
        const permissions = Array.isArray(formRes.permissions)
          ? formRes.permissions.join(',')
          : formRes.permissions;
        message.success('用户信息更新成功');
        closeModal();
        resetInfo();
        return true;
      } catch (error) {
        message.error('更新失败');
        setSubLoading(false);
        return false;
      }
    }
    setSubLoading(false);
    return false;
  }

  // 提交密码修改
  async function submitPassword() {
    const formRes = await submitPwd();
    if (formRes) {
      try {
        const res = await updateUserPwd({
          data: {
            userName: formRes.userName,
            password: formRes.oldPassword,
            newPassword: formRes.newPassword,
          },
        });
        if (res.code === 200) {
          message.success('密码修改成功');
          closeModal();
          resetPwd();
          return true;
        } else {
          message.error(res.message || '密码修改失败');
          setSubLoading(false);
          return false;
        }
      } catch (error) {
        message.error('密码修改失败');
        setSubLoading(false);
        return false;
      }
    }
    setSubLoading(false);
    return false;
  }

  defineExpose({
    openModal,
    showModal,
    closeModal,
    submitInfo,
    submitPassword,
  });
</script>
