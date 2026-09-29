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
        :row-key="(row: VMaterialData) => row.id"
        ref="actionRef"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1800"
        :striped="true"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="success" :loading="exportLoading" @click="handleExport">
              <template #icon>
                <n-icon>
                  <DownloadOutlined />
                </n-icon>
              </template>
              导出Excel
            </n-button>
            <n-button type="info" @click="refreshData">
              <template #icon>
                <n-icon>
                  <ReloadOutlined />
                </n-icon>
              </template>
              刷新
            </n-button>
          </n-space>
        </template>

        <template #toolbar> </template>
      </BasicTable>

      <!-- 查看详情弹窗 -->
      <n-modal v-model:show="showDetailModal" :show-icon="false" preset="dialog" title="物料详情">
        <n-descriptions bordered label-placement="left" :column="2">
          <n-descriptions-item label="PPID">{{ detailData.ppid }}</n-descriptions-item>
          <n-descriptions-item label="料架编号">{{ detailData.rackId }}</n-descriptions-item>
          <n-descriptions-item label="面别">{{ detailData.rackSide }}</n-descriptions-item>
          <n-descriptions-item label="储位号">{{ detailData.location }}</n-descriptions-item>
          <n-descriptions-item label="任务ID">{{ detailData.taskId }}</n-descriptions-item>
          <n-descriptions-item label="产品料号">{{ detailData.compPn }}</n-descriptions-item>
          <n-descriptions-item label="物料描述" :span="2">{{ detailData.description }}</n-descriptions-item>
          <n-descriptions-item label="数量">{{ detailData.qty }}</n-descriptions-item>
          <n-descriptions-item label="客户料号">{{ detailData.customerPn }}</n-descriptions-item>
          <n-descriptions-item label="供应商">{{ detailData.vendorCode }}</n-descriptions-item>
          <n-descriptions-item label="Date Code">{{ detailData.dateCode }}</n-descriptions-item>
          <n-descriptions-item label="Lot Code">{{ detailData.lotCode }}</n-descriptions-item>
          <n-descriptions-item label="组织">{{ detailData.orgCode }}</n-descriptions-item>
          <n-descriptions-item label="GUPN">{{ detailData.gupn }}</n-descriptions-item>
          <n-descriptions-item label="创建时间">{{ detailData.createTime }}</n-descriptions-item>
          <n-descriptions-item label="上架时间">{{ detailData.upTime }}</n-descriptions-item>
          <n-descriptions-item label="创建人">{{ detailData.createUser }}</n-descriptions-item>
        </n-descriptions>
      </n-modal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import {
    getMaterialList,
    exportMaterialList,
  } from '@/api/smr/vmaterial/material';
  import { columns, VMaterialData } from './columns';
  import { ReloadOutlined, DownloadOutlined } from '@vicons/antd';
  import { useMessage } from 'naive-ui';
  import * as XLSX from 'xlsx';

  const message = useMessage();
  const actionRef = ref();
  const exportLoading = ref(false);

  const showDetailModal = ref(false);
  const detailData = ref<VMaterialData>({} as VMaterialData);

  const schemas: FormSchema[] = [
    {
      field: 'ppid',
      component: 'NInput',
      label: 'PPID',
      componentProps: {
        placeholder: '请输入PPID',
      },
    },
    {
      field: 'rackId',
      component: 'NInput',
      label: '货架编号',
      componentProps: {
        placeholder: '请输入货架编号',
      },
    },
    {
      field: 'location',
      component: 'NInput',
      label: '储位号',
      componentProps: {
        placeholder: '请输入储位号',
        type: 'number',
      },
    },
    {
      field: 'startCreateTime',
      component: 'NDatePicker',
      label: '开始创建时间',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择开始创建时间',
        clearable: true,
        onUpdateValue: (val) => {
          if (val) {
            const formValues = getFieldsValue();
            formValues.startCreateTime = val;
          }
        },
      },
    },
    {
      field: 'endCreateTime',
      component: 'NDatePicker',
      label: '结束创建时间',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择结束创建时间',
        clearable: true,
      },
    },
    {
      field: 'startUpTime',
      component: 'NDatePicker',
      label: '开始上架时间',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择开始上架时间',
        clearable: true,
      },
    },
    {
      field: 'endUpTime',
      component: 'NDatePicker',
      label: '结束上架时间',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择结束上架时间',
        clearable: true,
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 110,
    schemas,
  });

  const loadDataTable = async (res) => {
    const fieldsValue = getFieldsValue();
    const requestData = {
      ppid: fieldsValue.ppid || undefined,
      rackId: fieldsValue.rackId || undefined,
      location: fieldsValue.location || undefined,
      startCreateTime: fieldsValue.startCreateTime || undefined,
      endCreateTime: fieldsValue.endCreateTime || undefined,
      startUpTime: fieldsValue.startUpTime || undefined,
      endUpTime: fieldsValue.endUpTime || undefined,
    };
    return await getMaterialList({ requestData, ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function refreshData() {
    reloadTable();
    message.success('刷新成功');
  }

  // 导出Excel
  async function handleExport() {
    try {
      exportLoading.value = true;
      const searchParams = getFieldsValue();
      const requestData = {
        ppid: searchParams.ppid || undefined,
        rackId: searchParams.rackId || undefined,
        location: searchParams.location || undefined,
        startCreateTime: searchParams.startCreateTime || undefined,
        endCreateTime: searchParams.endCreateTime || undefined,
        startUpTime: searchParams.startUpTime || undefined,
        endUpTime: searchParams.endUpTime || undefined,
      };

      const response = await exportMaterialList({
        requestData,
        pageSize: 999999,
        page: 1,
        current: 1
      });

      if (response.code === 200 && response.data && response.data.data) {
        const list = response.data.data;

        if (!list || list.length === 0) {
          message.warning('没有数据可导出');
          return;
        }

        const exportData = list.map((item: VMaterialData) => ({
          'PPID': item.ppid || '',
          '料架编号': item.rackId || '',
          '面别': item.rackSide || '',
          '储位号': item.location || '',
          '任务ID': item.taskId || '',
          '产品料号': item.compPn || '',
          '物料描述': item.description || '',
          '数量': item.qty || '',
          '客户料号': item.customerPn || '',
          '供应商': item.vendorCode || '',
          'Date Code': item.dateCode || '',
          'Lot Code': item.lotCode || '',
          '组织': item.orgCode || '',
          '创建时间': item.createTime ? new Date(item.createTime).toLocaleString() : '',
          '上架时间': item.upTime ? new Date(item.upTime).toLocaleString() : '',
          '创建人': item.createUser || '',
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        ws['!cols'] = [
          { wch: 20 }, // PPID
          { wch: 15 }, // 料架编号
          { wch: 8 },  // 面别
          { wch: 10 }, // 储位号
          { wch: 20 }, // 任务ID
          { wch: 15 }, // 产品料号
          { wch: 25 }, // 物料描述
          { wch: 10 }, // 数量
          { wch: 15 }, // 客户料号
          { wch: 15 }, // 供应商
          { wch: 12 }, // Date Code
          { wch: 12 }, // Lot Code
          { wch: 10 }, // 组织
          { wch: 20 }, // 创建时间
          { wch: 20 }, // 上架时间
          { wch: 15 }, // 创建人
        ];

        XLSX.utils.book_append_sheet(wb, ws, '物料信息');

        const fileName = `物料信息_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);

        message.success(`成功导出 ${list.length} 条数据`);
      } else {
        message.error(response.message || '导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后重试');
    } finally {
      exportLoading.value = false;
    }
  }

  function handleViewDetail(record: VMaterialData) {
    detailData.value = record;
    showDetailModal.value = true;
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
