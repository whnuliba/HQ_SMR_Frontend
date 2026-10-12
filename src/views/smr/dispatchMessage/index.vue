<template>
  <n-card :bordered="false">
    <n-tabs type="line" animated>
      <!-- 接口日志 Tab -->
      <n-tab-pane name="current" tab="接口日志">
        <n-card :bordered="false" class="mb-4">
          <BasicForm @register="registerCurrent" @submit="handleSubmitCurrent" @reset="handleResetCurrent">
            <template #statusSlot="{ model, field }">
              <n-input v-model:value="model[field]" />
            </template>
          </BasicForm>
        </n-card>
        <n-card :bordered="false">
          <BasicTable
            :columns="columns"
            :request="loadDataTableCurrent"
            :row-key="(row: DispatchMessageData) => row.id"
            ref="actionRefCurrent"
            :actionColumn="actionColumn"
            @update:checked-row-keys="onCheckedRow"
            :scroll-x="1400"
            :striped="true"
          >
            <template #tableTitle>
              <n-space>
                <n-button type="info" @click="refreshDataCurrent">
                  <template #icon>
                    <n-icon><ReloadOutlined /></n-icon>
                  </template>
                  刷新
                </n-button>
              </n-space>
            </template>
          </BasicTable>

          <!-- 报文详情弹窗 -->
          <n-modal v-model:show="showDetailModal" preset="dialog" title="报文详情" style="width: 900px; max-width: 90vw;">
            <n-descriptions bordered label-placement="left" :column="2" class="mb-4">
              <n-descriptions-item label="方向">
                <n-tag :type="ioStatusTagType[currentRecord?.ioStatus || '']">{{ ioStatusMap[currentRecord?.ioStatus || ''] }}</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="业务状态">
                <n-tag :type="bizStatusTagType[currentRecord?.bizStatus || '']">{{ bizStatusMap[currentRecord?.bizStatus || ''] }}</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="操作类型">{{ currentRecord?.operateType }}</n-descriptions-item>
              <n-descriptions-item label="料架编号">{{ currentRecord?.rackId }}</n-descriptions-item>
              <n-descriptions-item label="面别">{{ currentRecord?.rackSide }}</n-descriptions-item>
              <n-descriptions-item label="任务ID">{{ currentRecord?.taskId }}</n-descriptions-item>
              <n-descriptions-item label="PPID">{{ currentRecord?.ppId }}</n-descriptions-item>
              <n-descriptions-item label="请求ID">{{ currentRecord?.requestId }}</n-descriptions-item>
              <n-descriptions-item label="创建时间">{{ currentRecord?.createTime }}</n-descriptions-item>
            </n-descriptions>

            <n-tabs type="line">
              <n-tab-pane name="request" tab="请求报文">
                <CodeEditor :model-value="formatJson(currentRecord?.message)" :readonly="true" height="350px" />
              </n-tab-pane>
              <n-tab-pane name="response" tab="响应报文">
                <CodeEditor :model-value="formatJson(currentRecord?.respMessage)" :readonly="true" height="350px" />
              </n-tab-pane>
            </n-tabs>
          </n-modal>

          <!-- 修改状态弹窗 -->
          <n-modal v-model:show="showStatusModal" preset="dialog" title="修改状态">
            <n-form label-placement="left" label-width="80">
              <n-form-item label="当前状态">
                <n-tag :type="statusTagType[currentRecord?.status]" size="large">
                  {{ statusMap[currentRecord?.status] || '未知' }}
                </n-tag>
              </n-form-item>
              <n-form-item label="新状态" required>
                <n-select
                  v-model:value="newStatus"
                  :options="[
                    { label: '创建', value: 0 },
                    { label: '已发送', value: 1 },
                  ]"
                  placeholder="请选择新状态"
                  style="width: 200px"
                />
              </n-form-item>
              <n-form-item label="重试次数">
                <n-input-number v-model:value="newPostCount" :min="0" placeholder="请输入重试次数" style="width: 200px" />
              </n-form-item>
            </n-form>
            <template #action>
              <n-button @click="showStatusModal = false">取消</n-button>
              <n-button type="primary" @click="handleUpdateStatus" :loading="statusLoading">确定</n-button>
            </template>
          </n-modal>
        </n-card>
      </n-tab-pane>

      <!-- 归档接口日志 Tab -->
      <n-tab-pane name="history" tab="归档接口日志">
        <n-card :bordered="false" class="mb-4">
          <BasicForm @register="registerHis" @submit="handleSubmitHis" @reset="handleResetHis">
            <template #statusSlot="{ model, field }">
              <n-input v-model:value="model[field]" />
            </template>
          </BasicForm>
        </n-card>
        <n-card :bordered="false">
          <BasicTable
            :columns="hisColumns"
            :request="loadDataTableHis"
            :row-key="(row: DispatchMessageData) => row.id"
            ref="actionRefHis"
            :actionColumn="actionColumnHis"
            @update:checked-row-keys="onCheckedRow"
            :scroll-x="1600"
            :striped="true"
          >
            <template #tableTitle>
              <n-space>
                <n-button type="info" @click="refreshDataHis">
                  <template #icon>
                    <n-icon><ReloadOutlined /></n-icon>
                  </template>
                  刷新
                </n-button>
              </n-space>
            </template>
          </BasicTable>

          <!-- 归档报文详情弹窗 -->
          <n-modal v-model:show="showDetailModalHis" preset="dialog" title="归档报文详情" style="width: 900px; max-width: 90vw;">
            <n-descriptions bordered label-placement="left" :column="2" class="mb-4">
              <n-descriptions-item label="方向">
                <n-tag :type="ioStatusTagType[currentRecordHis?.ioStatus || '']">{{ ioStatusMap[currentRecordHis?.ioStatus || ''] }}</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="业务状态">
                <n-tag :type="bizStatusTagType[currentRecordHis?.bizStatus || '']">{{ bizStatusMap[currentRecordHis?.bizStatus || ''] }}</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="操作类型">{{ currentRecordHis?.operateType }}</n-descriptions-item>
              <n-descriptions-item label="料架编号">{{ currentRecordHis?.rackId }}</n-descriptions-item>
              <n-descriptions-item label="面别">{{ currentRecordHis?.rackSide }}</n-descriptions-item>
              <n-descriptions-item label="任务ID">{{ currentRecordHis?.taskId }}</n-descriptions-item>
              <n-descriptions-item label="PPID">{{ currentRecordHis?.ppId }}</n-descriptions-item>
              <n-descriptions-item label="请求ID">{{ currentRecordHis?.requestId }}</n-descriptions-item>
              <n-descriptions-item label="创建时间">{{ currentRecordHis?.createTime }}</n-descriptions-item>
              <n-descriptions-item label="归档时间" :span="2">{{ currentRecordHis?.lastModifyTime }}</n-descriptions-item>
            </n-descriptions>

            <n-tabs type="line">
              <n-tab-pane name="request" tab="请求报文">
                <CodeEditor :model-value="formatJson(currentRecordHis?.message)" :readonly="true" height="350px" />
              </n-tab-pane>
              <n-tab-pane name="response" tab="响应报文">
                <CodeEditor :model-value="formatJson(currentRecordHis?.respMessage)" :readonly="true" height="350px" />
              </n-tab-pane>
            </n-tabs>
          </n-modal>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getDispatchMessageList, getDispatchMessageHisList, updateStatus } from '@/api/smr/dispatchMessage/dispatchMessage';
  import { columns, hisColumns, DispatchMessageData, ioStatusMap, ioStatusTagType, bizStatusMap, bizStatusTagType, statusMap, statusTagType } from './columns';
  import { ReloadOutlined } from '@vicons/antd';
  import CodeEditor from '@/components/CodeEditor/index.vue';

  // ==================== 接口日志 Tab ====================
  const actionRefCurrent = ref();
  const showDetailModal = ref(false);
  const showStatusModal = ref(false);
  const currentRecord = ref<DispatchMessageData | null>(null);
  const newStatus = ref<number | null>(null);
  const newPostCount = ref<number | null>(null);
  const statusLoading = ref(false);

  const schemasCurrent: FormSchema[] = [
    {
      field: 'operateType',
      component: 'NInput',
      label: '操作类型',
      componentProps: {
        placeholder: '请输入操作类型',
      },
    },
    {
      field: 'rackId',
      component: 'NInput',
      label: '料架编号',
      componentProps: {
        placeholder: '请输入料架编号',
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
      field: 'ppId',
      component: 'NInput',
      label: 'PPID',
      componentProps: {
        placeholder: '请输入PPID',
      },
    },
    {
      field: 'requestId',
      component: 'NInput',
      label: '请求ID',
      componentProps: {
        placeholder: '请输入请求ID',
      },
    },
    {
      field: 'timeRange',
      component: 'NDatePicker',
      label: '时间范围',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择时间范围',
        clearable: true,
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    {
      field: 'message',
      component: 'NInput',
      label: '请求报文',
      componentProps: {
        placeholder: '请输入请求报文关键字',
      },
    },
    {
      field: 'respMessage',
      component: 'NInput',
      label: '响应报文',
      componentProps: {
        placeholder: '请输入响应报文关键字',
      },
    },
  ];

  const [registerCurrent, { getFieldsValue: getFieldsValueCurrent }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: schemasCurrent,
  });

  const loadDataTableCurrent = async (res) => {
    const fieldsValue = getFieldsValueCurrent();
    const requestData: any = { ...fieldsValue };
    // 处理时间范围
    if (fieldsValue.timeRange && fieldsValue.timeRange.length === 2) {
      requestData.beginTime = fieldsValue.timeRange[0];
      requestData.endTime = fieldsValue.timeRange[1];
    }
    delete requestData.timeRange;
    return await getDispatchMessageList({ requestData, ...res });
  };

  function handleSubmitCurrent() {
    actionRefCurrent.value?.reload();
  }

  function handleResetCurrent() {
    actionRefCurrent.value?.reload();
  }

  function refreshDataCurrent() {
    actionRefCurrent.value?.reload();
  }

  function handleViewDetailCurrent(record: DispatchMessageData) {
    currentRecord.value = record;
    showDetailModal.value = true;
  }

  function handleEditStatus(record: DispatchMessageData) {
    currentRecord.value = record;
    newStatus.value = null;
    newPostCount.value = record.postCount ?? null;
    showStatusModal.value = true;
  }

  async function handleUpdateStatus() {
    if (newStatus.value === null) {
      window.$message.warning('请选择新状态');
      return;
    }
    if (!currentRecord.value?.id) return;
    statusLoading.value = true;
    try {
      const res = await updateStatus(currentRecord.value.id, newStatus.value, newPostCount.value ?? undefined);
      if (res.code === 200) {
        window.$message.success('状态修改成功');
        showStatusModal.value = false;
        refreshDataCurrent();
      } else {
        window.$message.error(res.data?.message || res.data || '状态修改失败');
      }
    } finally {
      statusLoading.value = false;
    }
  }

  const actionColumn = reactive({
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: DispatchMessageData) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '详情',
            onClick: () => handleViewDetailCurrent(record),
          },
          {
            label: '改状态',
            onClick: () => handleEditStatus(record),
          },
        ],
      });
    },
  });

  // ==================== 归档接口日志 Tab ====================
  const actionRefHis = ref();
  const showDetailModalHis = ref(false);
  const currentRecordHis = ref<DispatchMessageData | null>(null);

  const schemasHis: FormSchema[] = [
    {
      field: 'operateType',
      component: 'NInput',
      label: '操作类型',
      componentProps: {
        placeholder: '请输入操作类型',
      },
    },
    {
      field: 'rackId',
      component: 'NInput',
      label: '料架编号',
      componentProps: {
        placeholder: '请输入料架编号',
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
      field: 'ppId',
      component: 'NInput',
      label: 'PPID',
      componentProps: {
        placeholder: '请输入PPID',
      },
    },
    {
      field: 'requestId',
      component: 'NInput',
      label: '请求ID',
      componentProps: {
        placeholder: '请输入请求ID',
      },
    },
    {
      field: 'timeRange',
      component: 'NDatePicker',
      label: '时间范围',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择时间范围',
        clearable: true,
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    {
      field: 'message',
      component: 'NInput',
      label: '请求报文',
      componentProps: {
        placeholder: '请输入请求报文关键字',
      },
    },
    {
      field: 'respMessage',
      component: 'NInput',
      label: '响应报文',
      componentProps: {
        placeholder: '请输入响应报文关键字',
      },
    },
  ];

  const [registerHis, { getFieldsValue: getFieldsValueHis }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: schemasHis,
  });

  const loadDataTableHis = async (res) => {
    const fieldsValue = getFieldsValueHis();
    const requestData: any = { ...fieldsValue };
    // 处理时间范围
    if (fieldsValue.timeRange && fieldsValue.timeRange.length === 2) {
      requestData.beginTime = fieldsValue.timeRange[0];
      requestData.endTime = fieldsValue.timeRange[1];
    }
    delete requestData.timeRange;
    return await getDispatchMessageHisList({ requestData, ...res });
  };

  function handleSubmitHis() {
    actionRefHis.value?.reload();
  }

  function handleResetHis() {
    actionRefHis.value?.reload();
  }

  function refreshDataHis() {
    actionRefHis.value?.reload();
  }

  function handleViewDetailHis(record: DispatchMessageData) {
    currentRecordHis.value = record;
    showDetailModalHis.value = true;
  }

  const actionColumnHis = reactive({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: DispatchMessageData) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '详情',
            onClick: () => handleViewDetailHis(record),
          },
        ],
      });
    },
  });

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  // 格式化JSON
  function formatJson(str: string | undefined | null): string {
    if (!str) return '(无数据)';
    try {
      const obj = JSON.parse(str);
      return JSON.stringify(obj, null, 2);
    } catch {
      return str;
    }
  }
</script>

<style lang="less" scoped>
  .mb-4 {
    margin-bottom: 16px;
  }
</style>
