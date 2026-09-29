<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row:RackTaskData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090"
        :striped="true"
      >
        <template #tableTitle>
          <!-- <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button> -->
        </template>

        <template #toolbar> </template>
      </BasicTable>

      <!-- <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="名称" path="name">
            <n-input placeholder="请输入名称" v-model:value="formParams.name" />
          </n-form-item>
          <n-form-item label="地址" path="address">
            <n-input type="textarea" placeholder="请输入地址" v-model:value="formParams.address" />
          </n-form-item>
          <n-form-item label="日期" path="date">
            <n-date-picker
              type="datetime"
              placeholder="请选择日期"
              v-model:value="formParams.date"
            />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal> -->
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getRackTask,cancelRackTask,forceCompleteTask,getRackTaskHis } from '@/api/smr/task/rack-task';
  import { columns, RackTaskData } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';
  import { useDialog, useMessage } from 'naive-ui'

 const message = useMessage()
 const dialog = useDialog()
  const rules: FormRules = {
    rackNo: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入货架编码',
    },
    taskType: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择任务类型',
    },
    ppid: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入PPID',
    }
  };

  const schemas: FormSchema[] = [
    {
      field: 'rackNo',
      labelMessage: '请输货架编号',
      component: 'NInput',
      label: '货架编号',
      componentProps: {
        placeholder: '请输货架编号',
        onInput: (e: any) => {
          console.log(e);
        },
      },
      rules: [{ required: true, message: '请输入货架编号', trigger: ['blur'] }],
    },
      {
      field: 'taskState',
      component: 'NSelect',
      label: '任务状态',
      componentProps: {
        placeholder: '请选择类型',
        options: [
          {
            label: '入库等待',
            value: 0,
          },
          {
            label: '出库等待',
            value: 1,
          },
           {
            label: '入库完成',
            value: 2,
          },     
          {
            label: '出库完成',
            value: 3,
          },
          
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },

    {
      field: 'taskType',
      component: 'NSelect',
      label: '任务类型',
      componentProps: {
        placeholder: '请选择类型',
        options: [
          {
            label: '入库',
            value: 0,
          },
          {
            label: '出库',
            value: 1,
          },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    // {
    //   field: 'createTime',
    //   component: 'NDatePicker',
    //   label: '创建时间',
    //   //defaultValue: 1183135260000,
    //   componentProps: {
    //     type: 'date',
    //     clearable: true,
    //     onUpdateValue: (e: any) => {
    //       console.log(e);
    //     },
    //   },
    // },
  ];

  const router = useRouter();
  const formRef: any = ref(null);
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });
const actionColumn = reactive({});
  // const actionColumn = reactive({
  //   width: 220,
  //   title: '操作',
  //   key: 'action',
  //   fixed: 'right',
  //   render(record) {
  //     return h(TableAction as any, {
  //       style: 'button',
  //       actions: [
  //         {
  //           label: '取消',
  //           onClick: handleDelete.bind(null, record),
  //           // 根据业务控制是否显示 isShow 和 auth 是并且关系
  //           ifShow: () => {
  //             return true;
  //           },
  //           // 根据权限控制是否显示: 有权限，会显示，支持多个
  //           //auth: ['basic_list'],
  //         },
  //         {
  //           label: '完成',
  //           onClick: handleEdit.bind(null, record),
  //           ifShow: () => {
  //             return true;
  //           },
  //           //auth: ['basic_list'],
  //         },
  //       ],
  //       // dropDownActions: [
  //       //   {
  //       //     label: '启用',
  //       //     key: 'enabled',
  //       //     // 根据业务控制是否显示: 非enable状态的不显示启用按钮
  //       //     ifShow: () => {
  //       //       return true;
  //       //     },
  //       //   },
  //       //   {
  //       //     label: '禁用',
  //       //     key: 'disabled',
  //       //     ifShow: () => {
  //       //       return true;
  //       //     },
  //       //   },
  //       // ],
  //       // select: (key) => {
  //       //   window['$message'].info(`您点击了，${key} 按钮`);
  //       // },
  //     });
  //   },
  // });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    const requestData = { ...getFieldsValue()}
    return await getRackTaskHis({ requestData, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        window['$message'].success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  function handleEdit(record: Recordable) {
    dialog.warning({
            title: '操作警告',
            content: '你确定要强制完成当前任务吗？',
            positiveText: '确定',
            negativeText: '取消',
            draggable: true,
            onPositiveClick: () => {
              forceCompleteTask(record).then((res)=>{
                  const {code}  = res;
                  if(code==200){
                         message.success('任务强制完成成功')
                         //    window['$message'].info('任务取消成功');
                  }else{
                       message.success('任务强制完成失败')
                  }
              }).catch(err=>{
                     message.success('任务强制完成失败')
              })
            },
            onNegativeClick: () => {
              //message.error('取消')
            }
          })
    //router.push({ name: 'basic-info', params: { id: record.id } });
  }
  function handleDelete(record: Recordable) {
            dialog.warning({
            title: '操作警告',
            content: '你确定要取消当前任务吗？',
            positiveText: '确定',
            negativeText: '取消',
            draggable: true,
            onPositiveClick: () => {
              cancelRackTask(record).then((res)=>{
                  const {code}  = res;
                  if(code==200){
                         message.success('任务取消成功')
                         //    window['$message'].info('任务取消成功');
                  }else{
                       message.success('任务取消成功')
                  }
              }).catch(err=>{
                     message.success('任务取消失败')
              })
            },
            onNegativeClick: () => {
              message.error('取消')
            }
          })

  }
  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }
</script>

<style lang="less" scoped></style>
