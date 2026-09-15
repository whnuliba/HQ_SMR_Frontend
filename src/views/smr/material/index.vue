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
        :row-key="(row: MaterialInfoData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1500"
        :striped="true"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="addTable">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新建
            </n-button>
            <n-button type="success" :loading="exportLoading" @click="handleExport">
              <template #icon>
                <n-icon>
                  <DownloadOutlined />
                </n-icon>
              </template>
              导出Excel
            </n-button>
          </n-space>
        </template>

        <template #toolbar> </template>
      </BasicTable>

      <!-- 新建/编辑弹窗 -->
      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="modalTitle">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="100"
          class="py-4"
        >
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi :span="12" label="任务ID" path="taskId">
              <n-input placeholder="请输入任务ID" v-model:value="formParams.taskId" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="料架ID" path="rackId">
              <n-input placeholder="请输入料架ID" v-model:value="formParams.rackId" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="面别" path="rackSide">
              <n-select
                placeholder="请选择面别"
                v-model:value="formParams.rackSide"
                :options="[
                  { label: 'A面', value: 'A' },
                  { label: 'B面', value: 'B' },
                ]"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="PPID" path="ppid">
              <n-input placeholder="请输入PPID" v-model:value="formParams.ppid" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="产品料号" path="compPn">
              <n-input placeholder="请输入产品料号" v-model:value="formParams.compPn" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="物料描述" path="description">
              <n-input placeholder="请输入物料描述" v-model:value="formParams.description" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="数量" path="qty">
              <n-input-number
                v-model:value="formParams.qty"
                placeholder="请输入数量"
                :min="0"
                clearable
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="客户料号" path="customerPn">
              <n-input placeholder="请输入客户料号" v-model:value="formParams.customerPn" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="供应商" path="vendorCode">
              <n-input placeholder="请输入供应商编码" v-model:value="formParams.vendorCode" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="亮灯颜色" path="lightColor">
              <n-select
                placeholder="请选择亮灯颜色"
                v-model:value="formParams.lightColor"
                :options="[
                  { label: '红', value: 1 },
                  { label: '淡白', value: 2 },
                  { label: '绿', value: 3 },
                  { label: '蓝', value: 4 },
                  { label: '黄绿', value: 5 },
                  { label: '紫', value: 6 },
                  { label: '黄', value: 7 },
                  { label: '浅蓝', value: 8 },
                  { label: '浅黄', value: 9 },
                ]"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="上架超时(秒)" path="outTime">
              <n-input-number
                v-model:value="formParams.outTime"
                placeholder="请输入超时时间"
                :min="0"
                clearable
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="操作类型" path="operateType">
              <n-input placeholder="请输入操作类型" v-model:value="formParams.operateType" />
            </n-form-item-gi>
          </n-grid>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="closeModal">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
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
  import { 
    getMaterialInfoList, 
    registerMaterialInfo,
    exportMaterialInfo 
  } from '@/api/smr/material/material';
  import { columns, MaterialInfoData, MaterialInfoForm } from './columns';
  import { PlusOutlined, DownloadOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';
  import * as XLSX from 'xlsx';

  const router = useRouter();
  const formRef: any = ref(null);
  const actionRef = ref();
  const exportLoading = ref(false);

  const showModal = ref(false);
  const isEdit = ref(false);
  const editId = ref<string>('');
  const formBtnLoading = ref(false);

  const modalTitle = ref('新建物料信息');

  const formParams: MaterialInfoForm = reactive({
    rackId: '',
    rackSide: 'A',
    taskId: '',
    ppid: '',
    compPn: '',
    description: '',
    qty: 0,
    customerPn: '',
    vendorCode: '',
    dateCode: '',
    lotCode: '',
    orgCode: '',
    no09: '',
    gupn: '',
    userId: '',
  });

  const rules: FormRules = {
    taskId: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入任务ID',
    },
    rackId: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入料架ID',
    },
    ppid: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入PPID',
    },
    compPn: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入产品料号',
    },
    qty: {
      type: 'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入数量',
    },
  };

  const schemas: FormSchema[] = [
    {
      field: 'taskId',
      component: 'NInput',
      label: '任务ID',
      componentProps: {
        placeholder: '请输入任务ID',
      },
    },
    {
      field: 'rackId',
      component: 'NInput',
      label: '料架ID',
      componentProps: {
        placeholder: '请输入料架ID',
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
      field: 'vendorCode',
      component: 'NInput',
      label: '供应商',
      componentProps: {
        placeholder: '请输入供应商编码',
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
  ];

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
            ifShow: () => true,
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => true,
            auth: ['basic_list'],
          },
        ],
        dropDownActions: [],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  function addTable() {
    isEdit.value = false;
    modalTitle.value = '新建物料信息';
    resetForm();
    showModal.value = true;
  }

  function resetForm() {
    Object.assign(formParams, {
      rackId: '',
      rackSide: 'A',
      taskId: '',
      ppid: '',
      compPn: '',
      description: '',
      qty: 0,
      customerPn: '',
      vendorCode: '',
      dateCode: '',
      lotCode: '',
      orgCode: '',
      no09: '',
      gupn: '',
      userId: '',
    });
  }

  function closeModal() {
    showModal.value = false;
    resetForm();
  }

  function handleEdit(record: MaterialInfoData) {
    isEdit.value = true;
    editId.value = record.id;
    modalTitle.value = '编辑物料信息';
    Object.assign(formParams, {
      rackId: record.rackId || '',
      rackSide: record.rackSide || 'A',
      taskId: record.taskId || '',
      ppid: record.ppid || '',
      compPn: record.compPn || '',
      description: record.description || '',
      qty: record.qty || 0,
      customerPn: record.customerPn || '',
      vendorCode: record.vendorCode || '',
      dateCode: record.dateCode || '',
      lotCode: record.lotCode || '',
      orgCode: record.orgCode || '',
      no09: record.no09 || '',
      gupn: record.gupn || '',
      userId: record.userId || '',
    });
    showModal.value = true;
  }

  function handleDelete(record: MaterialInfoData) {
    console.log('点击了删除', record);
    window['$message'].info('点击了删除');
  }

  const loadDataTable = async (res) => {
    const requestData = { ...getFieldsValue() };
    return await getMaterialInfoList({ requestData, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  // 导出Excel
  async function handleExport() {
    try {
      exportLoading.value = true;
      const searchParams = getFieldsValue();
      
      // 调用导出接口（放大分页尺寸）
      const response = await exportMaterialInfo({
        requestData: {
          ...searchParams,
          pageSize: 999999,
          pageIndex: 1,
        }
      });

      if (response.code === 200 && response.data && response.data.list) {
        const list = response.data.list;
        
        if (!list || list.length === 0) {
          window['$message'].warning('没有数据可导出');
          return;
        }

        // 准备导出数据
        const exportData = list.map((item: MaterialInfoData) => ({
          '任务ID': item.taskId || '',
          '料架ID': item.rackId || '',
          '面别': item.rackSide || '',
          'PPID': item.ppid || '',
          '产品料号': item.compPn || '',
          '物料描述': item.description || '',
          '数量': item.qty || 0,
          '客户料号': item.customerPn || '',
          '供应商': item.vendorCode || '',
          '亮灯颜色': item.lightColor ? lightColorMap[item.lightColor] || '' : '',
          '上架超时(秒)': item.outTime || '',
          '操作类型': item.operateType || '',
          'DC': item.dateCode || '',
          'LC': item.lotCode || '',
          '组织': item.orgCode || '',
          '09码': item.no09 || '',
          'GUPN': item.gupn || '',
          '创建时间': item.createTime ? new Date(item.createTime).toLocaleString() : '',
          '创建人': item.createUser || '',
        }));

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // 设置列宽
        ws['!cols'] = [
          { wch: 20 }, // 任务ID
          { wch: 15 }, // 料架ID
          { wch: 8 },  // 面别
          { wch: 18 }, // PPID
          { wch: 20 }, // 产品料号
          { wch: 30 }, // 物料描述
          { wch: 10 }, // 数量
          { wch: 20 }, // 客户料号
          { wch: 20 }, // 供应商
          { wch: 12 }, // 亮灯颜色
          { wch: 15 }, // 上架超时
          { wch: 15 }, // 操作类型
          { wch: 15 }, // DC
          { wch: 15 }, // LC
          { wch: 12 }, // 组织
          { wch: 15 }, // 09码
          { wch: 15 }, // GUPN
          { wch: 20 }, // 创建时间
          { wch: 15 }, // 创建人
        ];

        XLSX.utils.book_append_sheet(wb, ws, '物料信息');
        
        // 生成文件名
        const fileName = `物料信息_${new Date().toISOString().slice(0, 10)}.xlsx`;
        
        // 导出文件
        XLSX.writeFile(wb, fileName);
        
        window['$message'].success(`成功导出 ${list.length} 条数据`);
      } else {
        window['$message'].error(response.message || '导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      window['$message'].error('导出失败，请稍后重试');
    } finally {
      exportLoading.value = false;
    }
  }

  const confirmForm = async (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        registerMaterialInfo({ data: formParams })
          .then((response) => {
            const { code, message } = response;
            if (code == 200) {
              window['$message'].success(isEdit.value ? '编辑成功' : '新建成功');
              closeModal();
              reloadTable();
            } else {
              window['$message'].error(message);
            }
          })
          .catch((error) => {
            console.error('失败:', error);
            window['$message'].error('操作失败');
          });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }

  // 引入亮灯颜色映射（从columns.ts导入）
  import { lightColorMap } from './columns';
</script>

<style lang="less" scoped></style>