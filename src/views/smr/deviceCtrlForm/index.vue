<template>
  <div class="device-ctrl-container">
    <h2 class="page-title">设备控制面板</h2>
    
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <!-- 测试模式 -->
      <n-grid-item>
        <n-card title="切换测试模式" :bordered="true" size="small">
          <n-form :model="testForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="testForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="testForm.mode"
                :options="modeOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleTest">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="testResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="testResult.success ? 'success' : 'error'">
                {{ testResult.message }}
              </n-tag>
              <n-text v-if="testResult.data" code class="result-data">
                {{ JSON.stringify(testResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 单灯闪烁 -->
      <n-grid-item>
        <n-card title="单灯闪烁" :bordered="true" size="small">
          <n-form :model="singleLightFlashingForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="singleLightFlashingForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="闪烁次数">
              <n-input-number v-model:value="singleLightFlashingForm.times" placeholder="9999一直闪烁" />
            </n-form-item>
            <n-form-item label="储位编号">
              <n-input-number v-model:value="singleLightFlashingForm.addr" placeholder="请输入储位编号" />
            </n-form-item>
            <n-form-item label="颜色序号">
              <n-select
                v-model:value="singleLightFlashingForm.color"
                :options="colorOptions"
                placeholder="请选择颜色"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleSingleLightFlashing">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="singleLightFlashingResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="singleLightFlashingResult.success ? 'success' : 'error'">
                {{ singleLightFlashingResult.message }}
              </n-tag>
              <n-text v-if="singleLightFlashingResult.data" code class="result-data">
                {{ JSON.stringify(singleLightFlashingResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 循环全亮/灭 -->
      <n-grid-item>
        <n-card title="循环全亮/灭" :bordered="true" size="small">
          <n-form :model="lightAllLoopForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightAllLoopForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="颜色数目">
              <n-input-number v-model:value="lightAllLoopForm.length" placeholder="请输入颜色数目" />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="lightAllLoopForm.mode"
                :options="onOffOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightAllLoop">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightAllLoopResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightAllLoopResult.success ? 'success' : 'error'">
                {{ lightAllLoopResult.message }}
              </n-tag>
              <n-text v-if="lightAllLoopResult.data" code class="result-data">
                {{ JSON.stringify(lightAllLoopResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 多彩灯亮/灭 -->
      <n-grid-item>
        <n-card title="多彩灯亮/灭" :bordered="true" size="small">
          <n-form :model="lightOneLoopByColorForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightOneLoopByColorForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="开始储位序号">
              <n-input-number v-model:value="lightOneLoopByColorForm.addr" placeholder="请输入开始储位" />
            </n-form-item>
            <n-form-item label="灯数">
              <n-input-number v-model:value="lightOneLoopByColorForm.ledQty" placeholder="请输入灯数" />
            </n-form-item>
            <n-form-item label="颜色数目">
              <n-input-number v-model:value="lightOneLoopByColorForm.length" placeholder="请输入颜色数目" />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="lightOneLoopByColorForm.mode"
                :options="onOffOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightOneLoopByColor">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightOneLoopByColorResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightOneLoopByColorResult.success ? 'success' : 'error'">
                {{ lightOneLoopByColorResult.message }}
              </n-tag>
              <n-text v-if="lightOneLoopByColorResult.data" code class="result-data">
                {{ JSON.stringify(lightOneLoopByColorResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 单灯亮/灭 -->
      <n-grid-item>
        <n-card title="单灯亮/灭" :bordered="true" size="small">
          <n-form :model="lightOneLoopForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightOneLoopForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="开始储位序号">
              <n-input-number v-model:value="lightOneLoopForm.addr" placeholder="请输入开始储位" />
            </n-form-item>
            <n-form-item label="灯数">
              <n-input-number v-model:value="lightOneLoopForm.ledQty" placeholder="请输入灯数" />
            </n-form-item>
            <n-form-item label="颜色序号">
              <n-select
                v-model:value="lightOneLoopForm.color"
                :options="colorOptions"
                placeholder="请选择颜色"
              />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="lightOneLoopForm.mode"
                :options="onOffOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightOneLoop">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightOneLoopResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightOneLoopResult.success ? 'success' : 'error'">
                {{ lightOneLoopResult.message }}
              </n-tag>
              <n-text v-if="lightOneLoopResult.data" code class="result-data">
                {{ JSON.stringify(lightOneLoopResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 所有灯全亮 -->
      <n-grid-item>
        <n-card title="所有灯全亮" :bordered="true" size="small">
          <n-form :model="lightAllForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightAllForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="颜色代号">
              <n-select
                v-model:value="lightAllForm.color"
                :options="colorOptions"
                placeholder="请选择颜色"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightAll">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightAllResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightAllResult.success ? 'success' : 'error'">
                {{ lightAllResult.message }}
              </n-tag>
              <n-text v-if="lightAllResult.data" code class="result-data">
                {{ JSON.stringify(lightAllResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 所有灯全灭 -->
      <n-grid-item>
        <n-card title="所有灯全灭" :bordered="true" size="small">
          <n-form :model="downAllForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="downAllForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="warning" @click="handleDownAll">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="downAllResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="downAllResult.success ? 'success' : 'error'">
                {{ downAllResult.message }}
              </n-tag>
              <n-text v-if="downAllResult.data" code class="result-data">
                {{ JSON.stringify(downAllResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 单灯亮 -->
      <n-grid-item>
        <n-card title="单灯亮" :bordered="true" size="small">
          <n-form :model="lightSingleForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightSingleForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="灯的地址">
              <n-input-number v-model:value="lightSingleForm.ledAddr" placeholder="请输入灯的地址" />
            </n-form-item>
            <n-form-item label="颜色代号">
              <n-select
                v-model:value="lightSingleForm.color"
                :options="colorOptions"
                placeholder="请选择颜色"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightSingle">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightSingleResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightSingleResult.success ? 'success' : 'error'">
                {{ lightSingleResult.message }}
              </n-tag>
              <n-text v-if="lightSingleResult.data" code class="result-data">
                {{ JSON.stringify(lightSingleResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 单灯灭 -->
      <n-grid-item>
        <n-card title="单灯灭" :bordered="true" size="small">
          <n-form :model="downSingleForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="downSingleForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="灯的地址">
              <n-input-number v-model:value="downSingleForm.ledAddr" placeholder="请输入灯的地址" />
            </n-form-item>
            <n-form-item>
              <n-button type="warning" @click="handleDownSingle">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="downSingleResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="downSingleResult.success ? 'success' : 'error'">
                {{ downSingleResult.message }}
              </n-tag>
              <n-text v-if="downSingleResult.data" code class="result-data">
                {{ JSON.stringify(downSingleResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 多灯亮 -->
      <n-grid-item>
        <n-card title="多灯亮" :bordered="true" size="small">
          <n-form :model="lightMultiForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="lightMultiForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="地址列表">
              <n-dynamic-tags v-model:value="lightMultiForm.ledAddrs" />
            </n-form-item>
            <n-form-item label="颜色代号">
              <n-select
                v-model:value="lightMultiForm.color"
                :options="colorOptions"
                placeholder="请选择颜色"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleLightMulti">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="lightMultiResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="lightMultiResult.success ? 'success' : 'error'">
                {{ lightMultiResult.message }}
              </n-tag>
              <n-text v-if="lightMultiResult.data" code class="result-data">
                {{ JSON.stringify(lightMultiResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 多灯灭 -->
      <n-grid-item>
        <n-card title="多灯灭" :bordered="true" size="small">
          <n-form :model="downMultiForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="downMultiForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="地址列表">
              <n-dynamic-tags v-model:value="downMultiForm.ledAddrs" />
            </n-form-item>
            <n-form-item>
              <n-button type="warning" @click="handleDownMulti">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="downMultiResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="downMultiResult.success ? 'success' : 'error'">
                {{ downMultiResult.message }}
              </n-tag>
              <n-text v-if="downMultiResult.data" code class="result-data">
                {{ JSON.stringify(downMultiResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 大灯亮蜂鸣器响 -->
      <n-grid-item>
        <n-card title="大灯亮/蜂鸣器响" :bordered="true" size="small">
          <n-form :model="alarmLightForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="alarmLightForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="货架面">
              <n-select
                v-model:value="alarmLightForm.shelfSide"
                :options="shelfSideOptions"
                placeholder="请选择货架面"
              />
            </n-form-item>
            <n-form-item label="类型">
              <n-select
                v-model:value="alarmLightForm.color"
                :options="alarmTypeOptions"
                placeholder="请选择类型"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleAlarmLight">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="alarmLightResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="alarmLightResult.success ? 'success' : 'error'">
                {{ alarmLightResult.message }}
              </n-tag>
              <n-text v-if="alarmLightResult.data" code class="result-data">
                {{ JSON.stringify(alarmLightResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 大灯灭蜂鸣器停 -->
      <n-grid-item>
        <n-card title="大灯灭/蜂鸣器停" :bordered="true" size="small">
          <n-form :model="alarmDownForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="alarmDownForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="货架面">
              <n-select
                v-model:value="alarmDownForm.rackSide"
                :options="shelfSideOptions"
                placeholder="请选择货架面"
              />
            </n-form-item>
            <n-form-item label="类型">
              <n-select
                v-model:value="alarmDownForm.color"
                :options="alarmTypeOptions"
                placeholder="请选择类型"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="warning" @click="handleAlarmDown">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="alarmDownResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="alarmDownResult.success ? 'success' : 'error'">
                {{ alarmDownResult.message }}
              </n-tag>
              <n-text v-if="alarmDownResult.data" code class="result-data">
                {{ JSON.stringify(alarmDownResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 塔灯闪烁 -->
      <n-grid-item>
        <n-card title="塔灯闪烁" :bordered="true" size="small">
          <n-form :model="alarmLightFlashingForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="alarmLightFlashingForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="货架面">
              <n-select
                v-model:value="alarmLightFlashingForm.rackSide"
                :options="rackSideFullOptions"
                placeholder="请选择货架面"
              />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="alarmLightFlashingForm.mode"
                :options="flashModeOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleAlarmLightFlashing">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="alarmLightFlashingResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="alarmLightFlashingResult.success ? 'success' : 'error'">
                {{ alarmLightFlashingResult.message }}
              </n-tag>
              <n-text v-if="alarmLightFlashingResult.data" code class="result-data">
                {{ JSON.stringify(alarmLightFlashingResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 取消报警 -->
      <n-grid-item>
        <n-card title="报警&取消" :bordered="true" size="small">
          <n-form :model="alarmCancelForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="alarmCancelForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item label="货架面">
              <n-select
                v-model:value="alarmCancelForm.rackSide"
                :options="shelfSideOptions"
                placeholder="请选择货架面"
              />
            </n-form-item>
            <n-form-item label="模式">
              <n-select
                v-model:value="alarmCancelForm.mode"
                :options="alarmModeOptions"
                placeholder="请选择模式"
              />
            </n-form-item>
            <n-form-item label="指令类型">
                          <n-select
                v-model:value="alarmCancelForm.length"
                :options="alarmMode"
                placeholder="请选择指令类型"
              />
              <!-- <n-input-number v-model:value="alarmCancelForm.length" placeholder="请输入储位数目" /> -->
            </n-form-item>
            <n-form-item label="储位">
              <n-input v-model:value="alarmCancelForm.addrs" placeholder="储位用;分隔" />
            </n-form-item>
            <n-form-item>
              <n-button type="warning" @click="handleAlarmCancel">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="alarmCancelResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="alarmCancelResult.success ? 'success' : 'error'">
                {{ alarmCancelResult.message }}
              </n-tag>
              <n-text v-if="alarmCancelResult.data" code class="result-data">
                {{ JSON.stringify(alarmCancelResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 获取储位状态 -->
      <n-grid-item>
        <n-card title="获取储位状态" :bordered="true" size="small">
          <n-form :model="getAddrStatusForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="getAddrStatusForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleGetAddrStatus">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="getAddrStatusResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="getAddrStatusResult.success ? 'success' : 'error'">
                {{ getAddrStatusResult.message }}
              </n-tag>
              <n-text v-if="getAddrStatusResult.data" code class="result-data">
                {{ JSON.stringify(getAddrStatusResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 获取初始化配置信息 -->
      <n-grid-item>
        <n-card title="获取初始化配置信息" :bordered="true" size="small">
          <n-form :model="queryInitInfoForm" label-placement="left" label-width="100px">
            <n-form-item label="货架编号">
              <n-select
                v-model:value="queryInitInfoForm.rackNo"
                :options="rackOptions"
                filterable
                clearable
                placeholder="请选择或搜索货架编号"
                :loading="rackLoading"
              />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleQueryInitInfo">发送</n-button>
            </n-form-item>
          </n-form>
          <!-- 返回结果 -->
          <div v-if="queryInitInfoResult" class="result-area">
            <n-divider />
            <div class="result-content">
              <span class="result-label">返回结果：</span>
              <n-tag :type="queryInitInfoResult.success ? 'success' : 'error'">
                {{ queryInitInfoResult.message }}
              </n-tag>
              <n-text v-if="queryInitInfoResult.data" code class="result-data">
                {{ JSON.stringify(queryInitInfoResult.data) }}
              </n-text>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 消息提示 -->
    <n-message-provider />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import * as deviceApi from '@/api/smr/device/device-ctrl';
import type {
  Test,
  TestRequest,
  SingleLightFlashingRequest,
  LightAllLoopRequest,
  LightOneLoopByColorRequest,
  LightOneLoopRequest,
  LightAllRequest,
  DownAllRequest,
  LightSingleRequest,
  DownSingleRequest,
  LightMultiRequest,
  DownMultiRequest,
  AlarmLightRequest,
  AlarmDownRequest,
  AlarmCancelRequest,
  AlarmLightFlashingRequest,
  GetAddrStatusRequest,
  QueryInitInfoRequest,
  UpInductiveShelfRequest,
  CancelUpInductiveShelfRequest,
  DownInductiveShelfRequest,
  CancelDownInductiveShelfRequest,
  AlarmRequest,
  Rack,
}  from '@/components/Form/index';

// 定义响应结果类型
interface ResultState {
  success: boolean;
  message: string;
  data?: any;
}

const message = useMessage();

// 货架列表数据
const rackOptions = ref<Array<{ label: string; value: string }>>([]);
const rackLoading = ref(false);

// 下拉选项
const modeOptions = [
  { label: '正常模式', value: 0 },
  { label: '测试模式', value: 1 },
];

const onOffOptions = [
  { label: '灭', value: 0 },
  { label: '亮', value: 1 },
];

const colorOptions = [
  { label: '红色', value: 1 },
  { label: '白色', value: 2 },
  { label: '绿色', value: 3 },

];

const alarmMode = [
  { label: '取消', value: 1 },
  { label: '报警', value: 0 },
];

const alarmTypeOptions = [
  { label: '红灯', value: 0 },
  { label: '绿灯', value: 1 },
  { label: '蜂鸣器', value: 2 },
];

const shelfSideOptions = [
  { label: 'A面', value: 'A' },
  { label: 'B面', value: 'B' },
];

const rackSideFullOptions = [
  { label: 'A面', value: 'A' },
  { label: 'B面', value: 'B' },
  { label: 'AB面', value: 'AB' },
];

const flashModeOptions = [
  { label: '闪烁', value: 0 },
  { label: '取消闪烁', value: 1 },
];

const alarmModeOptions = [
  { label: '单个储位', value: 0 },
  { label: '多个储位', value: 1 },
  { label: '单面', value: 2 },
];

// 表单数据
const testForm = reactive<Test>({ rackNo: '', mode: 0 });
const singleLightFlashingForm = reactive<SingleLightFlashingRequest>({ rackNo: '', times: 0, addr: 0, color: 0 });
const lightAllLoopForm = reactive<LightAllLoopRequest>({ rackNo: '', length: 0, mode: 0 });
const lightOneLoopByColorForm = reactive<LightOneLoopByColorRequest>({ rackNo: '', addr: 0, ledQty: 0, length: 0, mode: 0 });
const lightOneLoopForm = reactive<LightOneLoopRequest>({ rackNo: '', addr: 0, ledQty: 0, color: 0, mode: 0 });
const lightAllForm = reactive<LightAllRequest>({ rackNo: '', color: 0 });
const downAllForm = reactive<DownAllRequest>({ rackNo: '' });
const lightSingleForm = reactive<LightSingleRequest>({ rackNo: '', ledAddr: 0, color: 0 });
const downSingleForm = reactive<DownSingleRequest>({ rackNo: '', ledAddr: 0 });
const lightMultiForm = reactive<LightMultiRequest>({ rackNo: '', ledAddrs: [], color: 0 });
const downMultiForm = reactive<DownMultiRequest>({ rackNo: '', ledAddrs: [] });
const alarmLightForm = reactive<AlarmLightRequest>({ rackNo: '', shelfSide: 'A', color: 0 });
const alarmDownForm = reactive<AlarmDownRequest>({ rackNo: '', rackSide: 'A', color: 0 });
const alarmCancelForm = reactive<AlarmCancelRequest>({ rackNo: '', rackSide: 'A', mode: 0, length: 0, addrs: '' });
const alarmLightFlashingForm = reactive<AlarmLightFlashingRequest>({ rackNo: '', rackSide: 'A', mode: 0 });
const getAddrStatusForm = reactive<GetAddrStatusRequest>({ rackNo: '' });
const queryInitInfoForm = reactive<QueryInitInfoRequest>({ rackNo: '' });

// 结果数据
const testResult = ref<ResultState | null>(null);
const singleLightFlashingResult = ref<ResultState | null>(null);
const lightAllLoopResult = ref<ResultState | null>(null);
const lightOneLoopByColorResult = ref<ResultState | null>(null);
const lightOneLoopResult = ref<ResultState | null>(null);
const lightAllResult = ref<ResultState | null>(null);
const downAllResult = ref<ResultState | null>(null);
const lightSingleResult = ref<ResultState | null>(null);
const downSingleResult = ref<ResultState | null>(null);
const lightMultiResult = ref<ResultState | null>(null);
const downMultiResult = ref<ResultState | null>(null);
const alarmLightResult = ref<ResultState | null>(null);
const alarmDownResult = ref<ResultState | null>(null);
const alarmCancelResult = ref<ResultState | null>(null);
const alarmLightFlashingResult = ref<ResultState | null>(null);
const getAddrStatusResult = ref<ResultState | null>(null);
const queryInitInfoResult = ref<ResultState | null>(null);

/**
 * 获取货架列表
 */
const fetchRackList = async () => {
  rackLoading.value = true;
  try {
    const res = await deviceApi.getAllRackNodes();
    if (res.code === 200 && res.data) {
      rackOptions.value = res.data.map((rack: any) => ({
        label: rack.rackNo || rack.RackNo || '',
        value: rack.rackNo || rack.RackNo || ''
      })).filter((item: any) => item.value);
    } else {
      message.error('获取货架列表失败');
    }
  } catch (error: any) {
    message.error(error?.message || '获取货架列表异常');
  } finally {
    rackLoading.value = false;
  }
};

// 页面加载时获取货架列表
onMounted(() => {
  fetchRackList();
});

// 通用请求处理
const handleRequest = async (
  apiFn: (data: any) => Promise<any>, 
  data: any, 
  successMsg: string,
  resultRef: any
) => {
  try {
    const res = await apiFn({ data });
    if (res.code === 200) {
      resultRef.value = {
        success: true,
        message: successMsg,
        data: res.data
      };
      message.success(successMsg);
    } else {
      resultRef.value = {
        success: false,
        message: res.msg || res.message || '请求失败',
        data: res.data
      };
      message.error(res.msg || res.message || '请求失败');
    }
  } catch (error: any) {
    resultRef.value = {
      success: false,
      message: error?.message || '请求异常',
      data: null
    };
    message.error(error?.message || '请求异常');
  }
};

// 各接口处理函数
const handleTest = () => 
  handleRequest(deviceApi.testMode, testForm, '切换测试模式成功', testResult);

const handleSingleLightFlashing = () => 
  handleRequest(deviceApi.singleLightFlashing, singleLightFlashingForm, '单灯闪烁请求已发送', singleLightFlashingResult);

const handleLightAllLoop = () => 
  handleRequest(deviceApi.lightAllLoop, lightAllLoopForm, '循环全亮/灭请求已发送', lightAllLoopResult);

const handleLightOneLoopByColor = () => 
  handleRequest(deviceApi.lightOneLoopByColor, lightOneLoopByColorForm, '多彩灯亮/灭请求已发送', lightOneLoopByColorResult);

const handleLightOneLoop = () => 
  handleRequest(deviceApi.lightOneLoop, lightOneLoopForm, '单灯亮/灭请求已发送', lightOneLoopResult);

const handleLightAll = () => 
  handleRequest(deviceApi.lightAll, lightAllForm, '所有灯全亮请求已发送', lightAllResult);

const handleDownAll = () => 
  handleRequest(deviceApi.downAll, downAllForm, '所有灯全灭请求已发送', downAllResult);

const handleLightSingle = () => 
  handleRequest(deviceApi.lightSingle, lightSingleForm, '单灯亮请求已发送', lightSingleResult);

const handleDownSingle = () => 
  handleRequest(deviceApi.downSingle, downSingleForm, '单灯灭请求已发送', downSingleResult);

const handleLightMulti = () => {
  if (lightMultiForm.ledAddrs.length === 0) {
    message.warning('请添加至少一个地址');
    return;
  }
  // 验证排序
  const sorted = [...lightMultiForm.ledAddrs].sort((a, b) => a - b);
  if (JSON.stringify(lightMultiForm.ledAddrs) !== JSON.stringify(sorted)) {
    message.warning('地址列表必须从小到大排序');
    return;
  }
  if (lightMultiForm.ledAddrs.length > 672) {
    message.warning('单次控制最多672个灯');
    return;
  }
  handleRequest(deviceApi.lightMulti, lightMultiForm, '多灯亮请求已发送', lightMultiResult);
};

const handleDownMulti = () => {
  if (downMultiForm.ledAddrs.length === 0) {
    message.warning('请添加至少一个地址');
    return;
  }
  const sorted = [...downMultiForm.ledAddrs].sort((a, b) => a - b);
  if (JSON.stringify(downMultiForm.ledAddrs) !== JSON.stringify(sorted)) {
    message.warning('地址列表必须从小到大排序');
    return;
  }
  if (downMultiForm.ledAddrs.length > 672) {
    message.warning('单次控制最多672个灯');
    return;
  }
  handleRequest(deviceApi.downMulti, downMultiForm, '多灯灭请求已发送', downMultiResult);
};

const handleAlarmLight = () => 
  handleRequest(deviceApi.alarmLight, alarmLightForm, '大灯亮/蜂鸣器响请求已发送', alarmLightResult);

const handleAlarmDown = () => 
  handleRequest(deviceApi.alarmDown, alarmDownForm, '大灯灭/蜂鸣器停请求已发送', alarmDownResult);

const handleAlarmCancel = () => 
  handleRequest(deviceApi.alarmCancel, alarmCancelForm, '取消报警请求已发送', alarmCancelResult);

const handleAlarmLightFlashing = () => 
  handleRequest(deviceApi.alarmLightFlashing, alarmLightFlashingForm, '塔灯闪烁请求已发送', alarmLightFlashingResult);

const handleGetAddrStatus = () => 
  handleRequest(deviceApi.getAddrStatus, getAddrStatusForm, '获取储位状态请求已发送', getAddrStatusResult);

const handleQueryInitInfo = () => 
  handleRequest(deviceApi.queryInitInfo, queryInitInfoForm, '获取初始化配置信息请求已发送', queryInitInfoResult);
</script>

<style scoped>
.device-ctrl-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: 600;
}

:deep(.n-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.n-card .n-card-header) {
  padding: 12px 16px;
  background: #f0f2f5;
  font-weight: 600;
}

:deep(.n-card .n-card__content) {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.n-form) {
  flex: 1;
}

:deep(.n-form-item) {
  margin-bottom: 12px;
}

:deep(.n-form-item:last-child) {
  margin-bottom: 0;
}

.result-area {
  margin-top: 12px;
  padding-top: 8px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}

.result-label {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.result-data {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  word-break: break-all;
  max-height: 120px;
  overflow-y: auto;
}

:deep(.n-divider) {
  margin: 8px 0;
}
</style>