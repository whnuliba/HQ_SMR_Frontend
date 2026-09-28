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
        :row-key="(row: RackRunningLogData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1300"
        :striped="true"
      >
        <template #tableTitle>
          <n-space>
            <!-- <n-button type="error" @click="handleBatchDelete">
              <template #icon>
                <n-icon>
                  <DeleteOutlined />
                </n-icon>
              </template>
              批量删除
            </n-button> -->
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
      <n-modal v-model:show="showDetailModal" :show-icon="false" preset="dialog" title="日志详情">
        <n-descriptions bordered label-placement="left" :column="2">
          <n-descriptions-item label="料架号">{{ detailData.rackNo }}</n-descriptions-item>
          <n-descriptions-item label="面别">{{ detailData.rackSide }}</n-descriptions-item>
          <n-descriptions-item label="库位">{{ detailData.location }}</n-descriptions-item>
          <n-descriptions-item label="任务ID">{{ detailData.taskId }}</n-descriptions-item>
          <n-descriptions-item label="PPID">{{ detailData.ppid }}</n-descriptions-item>
          <n-descriptions-item label="日志级别">
            <n-tag :type="logLevelTagType[detailData.logLevel] || 'default'">
              {{ logLevelMap[detailData.logLevel] || detailData.logLevel }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="日志内容" :span="2">
            <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">
              {{ detailData.message }}
            </div>
          </n-descriptions-item>
          <n-descriptions-item label="创建时间">{{ detailData.createTime }}</n-descriptions-item>
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
    getRackRunningLogList,
    deleteLogsBefore,
    exportRackRunningLog,
  } from '@/api/smr/rackRunningLog/rackRunningLog';
  import { columns, RackRunningLogData, logLevelMap, logLevelTagType } from './columns';
  import { DeleteOutlined, ReloadOutlined, DownloadOutlined } from '@vicons/antd';
  import { useDialog, useMessage } from 'naive-ui';
  import * as XLSX from 'xlsx';

  const message = useMessage();
  const dialog = useDialog();
  const actionRef = ref();
  const exportLoading = ref(false);

  const showDetailModal = ref(false);
  const detailData = ref<RackRunningLogData>({} as RackRunningLogData);

  const schemas: FormSchema[] = [
    {
      field: 'rackNo',
      component: 'NInput',
      label: '料架号',
      componentProps: {
        placeholder: '请输入料架号',
      },
    },
    {
      field: 'taskId',
      component: 'NInput',
      label: '任务ID',
      componentProps: {
        placeholder: '请输入任务ID',
      },
    },
    {
      field: 'logLevel',
      component: 'NSelect',
      label: '日志级别',
      componentProps: {
        placeholder: '请选择日志级别',
        options: [
          { label: '信息', value: 'INFO' },
          { label: '警告', value: 'WARN' },
          { label: '错误', value: 'ERROR' },
          { label: '调试', value: 'DEBUG' },
        ],
      },
    },
  ];

  const actionColumn = reactive({
    width: 180,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '详情',
            onClick: handleViewDetail.bind(null, record),
            ifShow: () => true,
          },
          // {
          //   label: '删除',
          //   onClick: handleDelete.bind(null, record),
          //   ifShow: () => true,
          // },
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

  const loadDataTable = async (res) => {
    const requestData = { ...getFieldsValue() };
    return await getRackRunningLogList({ requestData, ...res });
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
      
      const response = await exportRackRunningLog({
        requestData: {
          ...searchParams,
        }
         ,pageSize: 100000,
          page: 1,
          current: 1
      });

      if (response.code === 200 && response.data && response.data.data) {
        const list = response.data.data;
        
        if (!list || list.length === 0) {
          message.warning('没有数据可导出');
          return;
        }

        // 报警类型映射
        const alarmMap: Record<number, string> = {
          1: '温度',
          2: '湿度',
          3: '料架异常',
          4: '任务超时',
        };

        const exportData = list.map((item: RackRunningLogData) => ({
          '料架号': item.rackNo || '',
          '面别': item.rackSide || '',
          '库位': item.location || '',
          '任务ID': item.taskId || '',
          'PPID': item.ppid || '',
          '日志级别': item.logLevel ? logLevelMap[item.logLevel] || item.logLevel : '',
          '日志内容': item.message || '',
          '报警类型': item.alarmType ? alarmMap[item.alarmType] || '' : '',
          '创建时间': item.createTime ? new Date(item.createTime).toLocaleString() : '',
          '创建人': item.createUser || '',
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        ws['!cols'] = [
          { wch: 15 }, // 料架号
          { wch: 8 },  // 面别
          { wch: 12 }, // 库位
          { wch: 20 }, // 任务ID
          { wch: 18 }, // PPID
          { wch: 12 }, // 日志级别
          { wch: 50 }, // 日志内容
          { wch: 15 }, // 报警类型
          { wch: 20 }, // 创建时间
          { wch: 15 }, // 创建人
        ];

        XLSX.utils.book_append_sheet(wb, ws, '运行日志');
        
        const fileName = `运行日志_${new Date().toISOString().slice(0, 10)}.xlsx`;
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

  function handleViewDetail(record: RackRunningLogData) {
    detailData.value = record;
    showDetailModal.value = true;
  }

  function handleDelete(record: RackRunningLogData) {
    dialog.warning({
      title: '确认删除',
      content: `确定要删除这条日志记录吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const res = await deleteLogsBefore({ dateTime: record.createTime as unknown as string });
          if (res.code === 200) {
            message.success('删除成功');
            reloadTable();
          } else {
            message.error(res.message || '删除失败');
          }
        } catch (error) {
          message.error('操作失败');
        }
      },
    });
  }

  function handleBatchDelete() {
    dialog.warning({
      title: '批量删除日志',
      content: '确定要删除所有选中的日志记录吗？此操作不可恢复！',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.info('请通过日期筛选后使用"批量删除指定时间之前的日志"功能');
      },
    });
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