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
        :row-key="(row: RackAlarmData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1400"
        :striped="true"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="batchUpdateState(2)">
              <template #icon>
                <n-icon>
                  <CheckOutlined />
                </n-icon>
              </template>
              批量已处理
            </n-button>
            <n-button type="warning" @click="batchUpdateState(3)">
              <template #icon>
                <n-icon>
                  <CloseOutlined />
                </n-icon>
              </template>
              批量忽略
            </n-button>
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
      <n-modal v-model:show="showDetailModal" :show-icon="false" preset="dialog" title="报警详情">
        <n-descriptions bordered label-placement="left" :column="2">
          <n-descriptions-item label="料架号">{{ detailData.rackNo }}</n-descriptions-item>
          <n-descriptions-item label="面别">{{ detailData.rackSide }}</n-descriptions-item>
          <n-descriptions-item label="库位">{{ detailData.location }}</n-descriptions-item>
          <n-descriptions-item label="任务ID">{{ detailData.taskId }}</n-descriptions-item>
          <n-descriptions-item label="PPID">{{ detailData.ppid }}</n-descriptions-item>
          <n-descriptions-item label="报警类型">
            <n-tag :type="alarmTypeTagType[detailData.alarmType] || 'default'">
              {{ alarmTypeMap[detailData.alarmType] || '未知' }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="报警位置">
            <n-tag :type="locationTypeTagType[detailData.locationType] || 'default'">
              {{ locationTypeMap[detailData.locationType] || '未知' }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="处理状态">
            <n-tag :type="handleStateTagType[detailData.handleState] || 'default'">
              {{ handleStateMap[detailData.handleState] || '未知' }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="报警消息" :span="2">
            {{ detailData.message }}
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
    getRackAlarmList,
    batchUpdateHandleState,
    exportRackAlarm,
  } from '@/api/smr/rackAlarm/rackAlarm';
  import { columns, RackAlarmData, alarmTypeMap, 
    alarmTypeTagType, handleStateMap,
    locationTypeTagType,
    locationTypeMap, 
    handleStateTagType } from './columns';
  import { PlusOutlined, CheckOutlined, CloseOutlined, ReloadOutlined, DownloadOutlined } from '@vicons/antd';
  import { useDialog, useMessage } from 'naive-ui';
  import * as XLSX from 'xlsx';

  const message = useMessage();
  const dialog = useDialog();
  const actionRef = ref();
  const exportLoading = ref(false);

  const showDetailModal = ref(false);
  const detailData = ref<RackAlarmData>({} as RackAlarmData);

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
      field: 'alarmType',
      component: 'NSelect',
      label: '报警类型',
      componentProps: {
        placeholder: '请选择报警类型',
        options: [
          { label: '上架错误', value: 6 },
          { label: '下架错误', value: 7 },         
          { label: '料架异常', value: 3 },
          { label: '任务超时', value: 4 },
          { label: 'PPID重复', value: 5 },
          { label: '通讯异常', value: 8 },
          { label: '其他报警', value: 9 },
        ],
      },
    },
     {
      field: 'locationType',
      component: 'NSelect',
      label: '位置类型',
      componentProps: {
        placeholder: '请选择位置类型',
        options: [
          { label: '单储位', value: 0 },
          { label: '多储位', value: 1 },      
          { label: '单面', value: 2 },     
        ],
      },
    },
    {
      field: 'handleState',
      component: 'NSelect',
      label: '处理状态',
      componentProps: {
        placeholder: '请选择处理状态',
        options: [
          { label: '待处理', value: 0 },
          { label: '处理中', value: 1 },
          { label: '已处理', value: 2 },
          { label: '已忽略', value: 3 },
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
            label: '详情',
            onClick: handleViewDetail.bind(null, record),
            ifShow: () => true,
          },
          {
            label: '消除',
            onClick: handleUpdateState.bind(null, record, 2),
            ifShow: () => record.handleState === 0 || record.handleState === 1,
          },
          {
            label: '忽略',
            onClick: handleUpdateState.bind(null, record, 3),
            ifShow: () => record.handleState === 0 || record.handleState === 1,
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

  const loadDataTable = async (res) => {
    const requestData = { ...getFieldsValue() };
    return await getRackAlarmList({ requestData, ...res });
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
      
      const response = await exportRackAlarm({
        requestData: {
          ...searchParams,
          pageSize: 999999,
          pageIndex: 1,
        }
      });

      if (response.code === 200 && response.data && response.data.list) {
        const list = response.data.list;
        
        if (!list || list.length === 0) {
          message.warning('没有数据可导出');
          return;
        }

        const exportData = list.map((item: RackAlarmData) => ({
          '料架号': item.rackNo || '',
          '面别': item.rackSide || '',
          '库位': item.location || '',
          '任务ID': item.taskId || '',
          'PPID': item.ppid || '',
          '报警类型': item.alarmType ? alarmTypeMap[item.alarmType] || '' : '',
          '报警位置': item.locationType ? locationTypeMap[item.locationType] || '' : '',
          '报警消息': item.message || '',
          '处理状态': item.handleState !== undefined && item.handleState !== null 
            ? handleStateMap[item.handleState] || '' 
            : '',
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
          { wch: 15 }, // 报警类型
          { wch: 40 }, // 报警消息
          { wch: 12 }, // 处理状态
          { wch: 20 }, // 创建时间
          { wch: 15 }, // 创建人
        ];

        XLSX.utils.book_append_sheet(wb, ws, '货架报警');
        
        const fileName = `货架报警_${new Date().toISOString().slice(0, 10)}.xlsx`;
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

  function handleViewDetail(record: RackAlarmData) {
    detailData.value = record;
    showDetailModal.value = true;
  }

  function handleUpdateState(record: RackAlarmData, state: number) {
    dialog.warning({
      title: '确认操作',
      content: `确定要将该报警的处理状态更新为"${handleStateMap[state]}"吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const res = await batchUpdateHandleState({
            data: { ids: [record.id], handleState: state }
          });
          if (res.code === 200) {
            message.success('更新成功');
            reloadTable();
          } else {
            message.error(res.message || '更新失败');
          }
        } catch (error) {
          message.error('操作失败');
        }
      },
    });
  }

  function batchUpdateState(state: number) {
    const checkedRowKeys = actionRef.value?.getCheckedRowKeys?.() || [];
    if (!checkedRowKeys || checkedRowKeys.length === 0) {
      message.warning('请先选择要操作的记录');
      return;
    }

    dialog.warning({
      title: '确认批量操作',
      content: `确定要将选中的 ${checkedRowKeys.length} 条报警处理状态更新为"${handleStateMap[state]}"吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const res = await batchUpdateHandleState({
            data: { ids: checkedRowKeys, handleState: state }
          });
          if (res.code === 200) {
            message.success(`成功更新 ${res.data} 条记录`);
            reloadTable();
          } else {
            message.error(res.message || '更新失败');
          }
        } catch (error) {
          message.error('操作失败');
        }
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