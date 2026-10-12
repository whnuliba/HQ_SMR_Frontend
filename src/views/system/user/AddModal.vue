<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { addUser } from '@/api/system/userManagement';
  import { useMessage } from 'naive-ui';

  const message = useMessage();

  const schemas: FormSchema[] = [
    {
      field: 'username',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: [{ required: true, message: '请输入用户名', trigger: ['blur'] }],
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
      field: 'password',
      component: 'NInput',
      label: '密码',
      componentProps: {
        type: 'password',
        showPasswordOn: 'click',
        placeholder: '请输入密码',
      },
      rules: [
        { required: true, message: '请输入密码', trigger: ['blur'] },
        { type: 'string', min: 6, message: '密码至少6位', trigger: ['blur'] },
      ],
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
  ];

  const [registerForm, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增用户',
    subBtuText: '保存',
  });

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      try {
        const permissions = Array.isArray(formRes.permissions)
          ? formRes.permissions.join(',')
          : formRes.permissions;
        const res = await addUser({
          data: {
            ...formRes,
            permissions,
            status: 0,
          },
        });
        if (res.code === 200) {
          message.success('添加成功');
          closeModal();
          resetFields();
        } else {
          message.error(res.message || '添加失败');
          setSubLoading(false);
        }
      } catch (error) {
        message.error('添加失败');
        setSubLoading(false);
      }
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    openModal,
    closeModal,
  });
</script>
