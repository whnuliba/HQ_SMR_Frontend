<template>
  <n-card title="下架测试" :bordered="false">
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
          <n-form-item label="用户ID" path="userId">
            <n-input v-model:value="formData.userId" placeholder="请输入用户ID" />
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
      </n-grid>

      <n-divider>货架储位信息</n-divider>

      <n-space vertical :size="12">
        <n-space>
          <n-button type="primary" dashed @click="addRack">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            添加货架
          </n-button>
        </n-space>

        <n-card v-for="(rack, index) in formData.rackClass" :key="index" size="small">
          <n-grid :cols="3" :x-gap="12">
            <n-gi>
              <n-form-item label="货架编号" :path="`rackClass.${index}.rackId`" :rule="rackRules.rackId">
                <n-input v-model:value="rack.rackId" placeholder="请输入货架编号" />
              </n-form-item>
            </n-gi>
            <n-gi :span="2">
              <n-form-item label="储位号" :path="`rackClass.${index}.cellList`">
                <n-dynamic-input
                  v-model:value="rack.cellList"
                  placeholder="请输入储位号"
                  :min="1"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-button type="error" size="small" dashed @click="removeRack(index)">删除</n-button>
        </n-card>
      </n-space>

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
  import { PlusOutlined } from '@vicons/antd';
  import { downRackCMD, DownRackRequest, DownRackResponse, RackLocationDto } from '@/api/smr/wmsops/down/down';

  const message = useMessage();
  const loading = ref(false);
  const formRef = ref();
  const responseData = ref<DownRackResponse | null>(null);

  const formData = reactive<DownRackRequest>({
    rackCmd: 'Down',
    rackClass: [],
    lightColor: undefined,
    outTime: undefined,
    userId: '',
  });

  const rules = {
    rackCmd: { required: true, message: '请选择命令类型', trigger: 'change' },
  };

  const rackRules = {
    rackId: { required: true, message: '请输入货架编号', trigger: 'blur' },
  };

  const rackCmdOptions = [
    { label: '请求下架命令', value: 'Down' },
    { label: '请求下架结束', value: 'Down_end' },
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

  function addRack() {
    formData.rackClass.push({
      rackId: '',
      cellList: [''],
    });
  }

  function removeRack(index: number) {
    formData.rackClass.splice(index, 1);
  }

  async function handleSubmit() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }

    // 验证货架数据
    if (!formData.rackClass || formData.rackClass.length === 0) {
      message.warning('请至少添加一个货架');
      return;
    }

    for (let i = 0; i < formData.rackClass.length; i++) {
      const rack = formData.rackClass[i];
      if (!rack.rackId) {
        message.warning(`第${i + 1}个货架的货架编号不能为空`);
        return;
      }
      if (!rack.cellList || rack.cellList.length === 0 || !rack.cellList[0]) {
        message.warning(`第${i + 1}个货架的储位号不能为空`);
        return;
      }
    }

    loading.value = true;
    try {
      const requestData: DownRackRequest = {
        rackCmd: formData.rackCmd,
        rackClass: formData.rackClass.map((rack) => ({
          rackId: rack.rackId,
          cellList: rack.cellList.filter((cell) => cell !== ''),
        })),
        lightColor: formData.lightColor || undefined,
        outTime: formData.outTime || undefined,
        userId: formData.userId || undefined,
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId(),
      };

      const res = await downRackCMD(requestData);

      if (res.code === 200 && res.data) {
        responseData.value = res.data as unknown as DownRackResponse;
        if (responseData.value.code === 0) {
          message.success('下架请求成功');
        } else {
          message.error(responseData.value.message || '下架请求失败');
        }
      } else {
        message.error(res.message || '请求失败');
      }
    } catch (error) {
      console.error('下架请求失败:', error);
      message.error('下架请求失败');
    } finally {
      loading.value = false;
    }
  }

  function handleReset() {
    formRef.value?.restoreValidation();
    Object.assign(formData, {
      rackCmd: 'Down',
      rackClass: [],
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
