<template>
  <n-card title="上架测试" :bordered="false">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      :style="{ maxWidth: '800px' }"
    >
      <n-grid :cols="2" :x-gap="24">
        <n-gi>
          <n-form-item label="命令类型" path="rackCmd">
            <n-select
              v-model:value="formData.rackCmd"
              :options="rackCmdOptions"
              placeholder="请选择命令类型"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="料架编号" path="rackId">
            <n-input v-model:value="formData.rackId" placeholder="请输入料架编号" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="面别" path="rackSide">
            <n-select
              v-model:value="formData.rackSide"
              :options="rackSideOptions"
              placeholder="请选择面别"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="PPID" path="ppid">
            <n-input v-model:value="formData.ppid" placeholder="请输入PPID" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="产品料号" path="compPn">
            <n-input v-model:value="formData.compPn" placeholder="请输入产品料号" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="物料描述" path="description">
            <n-input v-model:value="formData.description" placeholder="请输入物料描述" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="数量" path="qty">
            <n-input-number v-model:value="formData.qty" :min="0" placeholder="请输入数量" style="width: 100%" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="客户料号" path="customerPn">
            <n-input v-model:value="formData.customerPn" placeholder="请输入客户料号" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="供应商" path="vendorCode">
            <n-input v-model:value="formData.vendorCode" placeholder="请输入供应商代码" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="Date Code" path="dateCode">
            <n-input v-model:value="formData.dateCode" placeholder="请输入Date Code" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="Lot Code" path="lotCode">
            <n-input v-model:value="formData.lotCode" placeholder="请输入Lot Code" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="组织" path="orgCode">
            <n-input v-model:value="formData.orgCode" placeholder="请输入组织代码" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="亮灯颜色" path="lightColor">
            <n-select
              v-model:value="formData.lightColor"
              :options="lightColorOptions"
              placeholder="请选择亮灯颜色"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="超时时间" path="outTime">
            <n-input-number
              v-model:value="formData.outTime"
              :min="0"
              placeholder="超时时间(秒)"
              style="width: 100%"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="用户ID" path="userId">
            <n-input v-model:value="formData.userId" placeholder="请输入用户ID" />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-space>
        <n-button type="primary" :loading="loading" @click="handleSubmit">提交</n-button>
        <n-button @click="handleReset">重置</n-button>
      </n-space>
    </n-form>

    <!-- 响应结果显示 -->
    <n-divider v-if="responseData">响应结果</n-divider>
    <n-card v-if="responseData" :bordered="false" size="small">
      <n-descriptions bordered label-placement="left" :column="2">
        <n-descriptions-item label="状态码">
          <n-tag :type="responseData.code === 0 ? 'success' : 'error'">
            {{ responseData.code === 0 ? '成功' : '失败' }} ({{ responseData.code }})
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="料架编号">{{ responseData.rackId }}</n-descriptions-item>
        <n-descriptions-item label="储位ID">{{ responseData.cellId || '-' }}</n-descriptions-item>
        <n-descriptions-item label="消息">{{ responseData.message }}</n-descriptions-item>
        <n-descriptions-item label="时间戳">{{ responseData.timestamp }}</n-descriptions-item>
        <n-descriptions-item label="会话ID">{{ responseData.sessionId }}</n-descriptions-item>
      </n-descriptions>
    </n-card>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { upRackCMD, UpRackRequest, UpRackResponse } from '@/api/smr/wmsops/putway/putway';

  const message = useMessage();
  const loading = ref(false);
  const formRef = ref();
  const responseData = ref<UpRackResponse | null>(null);

  const formData = reactive<UpRackRequest>({
    rackCmd: 'Up',
    rackId: '',
    rackSide: undefined,
    ppid: '',
    compPn: '',
    description: '',
    qty: undefined,
    customerPn: '',
    vendorCode: '',
    dateCode: '',
    lotCode: '',
    orgCode: '',
    lightColor: undefined,
    outTime: undefined,
    userId: '',
  });

  const rules = {
    rackCmd: { required: true, message: '请选择命令类型', trigger: 'change' },
    rackId: { required: true, message: '请输入料架编号', trigger: 'blur' },
  };

  const rackCmdOptions = [
    { label: '请求上架命令', value: 'Up' },
    { label: '请求上架结束', value: 'Up_end' },
  ];

  const rackSideOptions = [
    { label: 'A面', value: 'A' },
    { label: 'B面', value: 'B' },
  ];

  const lightColorOptions = [
    { label: '红', value: 1 },
    { label: '淡白', value: 2 },
    { label: '绿', value: 3 },
    { label: '蓝', value: 4 },
    { label: '黄绿', value: 5 },
    { label: '紫', value: 6 },
    { label: '黄', value: 7 },
    { label: '浅蓝', value: 8 },
    { label: '浅黄', value: 9 },
  ];

  async function handleSubmit() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }

    loading.value = true;
    try {
      const requestData: UpRackRequest = {
        rackCmd: formData.rackCmd,
        rackId: formData.rackId,
        rackSide: formData.rackSide || undefined,
        ppid: formData.ppid || undefined,
        compPn: formData.compPn || undefined,
        description: formData.description || undefined,
        qty: formData.qty || undefined,
        customerPn: formData.customerPn || undefined,
        vendorCode: formData.vendorCode || undefined,
        dateCode: formData.dateCode || undefined,
        lotCode: formData.lotCode || undefined,
        orgCode: formData.orgCode || undefined,
        lightColor: formData.lightColor || undefined,
        outTime: formData.outTime || undefined,
        userId: formData.userId || undefined,
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId(),
      };

      const res = await upRackCMD(requestData);

      if (res.code === 200 && res.data) {
        responseData.value = res.data as unknown as UpRackResponse;
        if (responseData.value.code === 0) {
          message.success('上架请求成功');
        } else {
          message.error(responseData.value.message || '上架请求失败');
        }
      } else {
        message.error(res.message || '请求失败');
      }
    } catch (error) {
      console.error('上架请求失败:', error);
      message.error('上架请求失败');
    } finally {
      loading.value = false;
    }
  }

  function handleReset() {
    formRef.value?.restoreValidation();
    Object.assign(formData, {
      rackCmd: 'Up',
      rackId: '',
      rackSide: undefined,
      ppid: '',
      compPn: '',
      description: '',
      qty: undefined,
      customerPn: '',
      vendorCode: '',
      dateCode: '',
      lotCode: '',
      orgCode: '',
      lightColor: undefined,
      outTime: undefined,
      userId: '',
    });
    responseData.value = null;
  }

  function generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
</script>

<style lang="less" scoped></style>
