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
        :row-key="(row:RackData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090"
        :striped="true"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
        </template>

        <template #toolbar> </template>
      </BasicTable>

      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="货架编号" path="rackNo">
            <n-input placeholder="请输入货架编号" v-model:value="formParams.rackNo" />
          </n-form-item>
          <n-form-item label="IP地址" path="ip">
            <n-input  placeholder="请输入ip地址" v-model:value="formParams.ip" />
          </n-form-item>
          <n-form-item label="端口" path="port">
            <n-input-number v-model:value="formParams.port"  placeholder="请输入端口" clearable />
          </n-form-item>
          <n-form-item label="A面起始地址端口" path="aSideStartIndex">
            <n-input-number v-model:value="formParams.aSideStartIndex"  placeholder="请输入A面起始地址" clearable />
          </n-form-item>
           <n-form-item label="A面地址数量" path="aSideCount">
            <n-input-number v-model:value="formParams.aSideCount"  placeholder="请输入A面地址数量" clearable />
          </n-form-item>
           <n-form-item label="B面地址数量" path="bSideCount">
            <n-input-number v-model:value="formParams.bSideCount"  placeholder="请输入B面地址数量" clearable />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- 变更货架 -->
      <n-modal v-model:show="showChangeModal" :show-icon="false" preset="dialog" title="变更">
        <n-form
          :model="changeParams"
          ref="changeFormRef"
          label-placement="left"
          :label-width="100"
          class="py-4"
        >
          <n-form-item label="货架号">
            <n-input v-model:value="changeParams.rackNo" placeholder="请输入货架号" />
          </n-form-item>
          <n-form-item label="IP地址">
            <n-input v-model:value="changeParams.ip" placeholder="请输入IP地址" />
          </n-form-item>
          <n-form-item label="端口">
            <n-input-number v-model:value="changeParams.port" placeholder="请输入端口" clearable style="width: 100%" />
          </n-form-item>
          <n-form-item label="A面数量">
            <n-input-number v-model:value="changeParams.aSideQty" placeholder="请输入A面数量" clearable style="width: 100%" />
          </n-form-item>
          <n-form-item label="B面数量">
            <n-input-number v-model:value="changeParams.bSideQty" placeholder="请输入B面数量" clearable style="width: 100%" />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showChangeModal = false)">取消</n-button>
            <n-button type="info" :loading="changeBtnLoading" @click="confirmChange">确定</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getRack,registerRack, updateRack,deleteRack } from '@/api/smr/rack/rack';
  import { columns, RackData,RackNodeForm } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';
  import { useDialog, useMessage } from 'naive-ui';

const message = useMessage()
 const dialog = useDialog()
  
  const rules: FormRules = {
    rackNo: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入货架编码',
    },
    ip: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入货架IP',
    },
    port: {
      type:'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入货架端口',
    },
    aSideStartIndex: {
       type:'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入A面起始位置',
    },
     aSideCount: {
       type:'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入A面位置数量',
    },
     bSideCount: {
       type:'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入B面位置数量',
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
    },
    {
      field: 'ip',
      labelMessage: '请输货架IP',
      component: 'NInput',
      label: '货架IP',
      componentProps: {
        placeholder: '请输货架IP',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    // {
    //   field: 'enable',
    //   component: 'NSelect',
    //   label: '启用状态',
    //   componentProps: {
    //     placeholder: '请选择类型',
    //     options: [
    //       {
    //         label: '禁用',
    //         value: 0,
    //       },
    //       {
    //         label: '启用',
    //         value: 1,
    //       },
    //     ],
    //     onUpdateValue: (e: any) => {
    //       console.log(e);
    //     },
    //   },
    // },
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

  const formParams :RackNodeForm= reactive({
        rackNo:'',
        aSide:'A',
        aSideCount:0,
        aSideStartIndex:0,
        bSide:'B',
        bSideStartIndex:1,
        bSideCount:0,
        ip:'',
        port:0,
  });

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
          },
          {
            label: '变更',
            onClick: handleChange.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
        ],
      });
    },
  });

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
    return await getRack({ requestData, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  const confirmForm = async (e) =>{

    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
      registerRack({data: formParams}).then(response => {
      const { message, code, status, data } = response;
       if(code==200){
          console.log('成功:', response);
          window['$message'].success('新建成功');
       }else{
          window['$message'].error(message);
       }
        })
        .catch(error => {
          console.error('失败:', error);
           window['$message'].console.error(error);
        });
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

  // function confirmForm(e) {
  //   e.preventDefault();
  //   formBtnLoading.value = true;
  //   formRef.value.validate((errors) => {
  //     if (!errors) {
  //       window['$message'].success('新建成功');
  //       setTimeout(() => {
  //         showModal.value = false;
  //         reloadTable();
  //       });
  //     } else {
  //       window['$message'].error('请填写完整信息');
  //     }
  //     formBtnLoading.value = false;
  //   });
  // }

  // ==================== 变更货架 ====================
  const showChangeModal = ref(false);
  const changeBtnLoading = ref(false);
  const changeFormRef: any = ref(null);
  const changeParams = reactive<any>({
    id: '',
    rackNo: '',
    ip: '',
    port: null,
    aSideQty: null,
    bSideQty: null,
  });

  function handleChange(record: RackData) {
    changeParams.id = record.id;
    changeParams.rackNo = record.rackNo ?? '';
    changeParams.ip = record.ip ?? '';
    changeParams.port = record.port ?? null;
    changeParams.aSideQty = record.aSideQty ?? null;
    changeParams.bSideQty = record.bSideQty ?? null;
    showChangeModal.value = true;
  }

  const confirmChange = async () => {
    changeBtnLoading.value = true;
    try {
      const res = await updateRack({ data: { ...changeParams } });
      if (res.code === 200 || res.status === 'SUCCESS') {
        window['$message'].success('变更成功');
        showChangeModal.value = false;
        reloadTable();
      } else {
        window['$message'].error(res.data?.message || '变更失败');
      }
    } catch (error) {
      window['$message'].error('变更失败');
    } finally {
      changeBtnLoading.value = false;
    }
  };

  function handleDelete(record: Recordable) {
    
  dialog.warning({
            title: '操作警告',
            content: '你确定要删除货架吗，删除后不可恢复，必须重建？',
            positiveText: '确定',
            negativeText: '取消',
            draggable: true,
            onPositiveClick: () => {
              deleteRack({data:record}).then((res)=>{
                  const {code}  = res;
                  let msg = res.message
                  if(code==200){
                      message.success('删除成功')
                         //    window['$message'].info('任务取消成功');
                  }else{
                       message.error('删除失败:'+msg)
                  }
              }).catch(err=>{
                     message.success('删除失败')
              })
            },
            onNegativeClick: () => {
              message.error('取消')
            }
          })
    window['$message'].info('点击了删除');
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
