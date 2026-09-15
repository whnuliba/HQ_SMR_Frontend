import { Alova } from '@/utils/http/alova/ids-request';

// 获取报警列表
export function getRackAlarmList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/list',
    {
      ...params
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 导出报警信息（全量）
export function exportRackAlarm(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/list',
    {
      ...params,
      requestData: {
        ...params.requestData,
        pageSize: 999999, // 放大分页尺寸以获取全部数据
        pageIndex: 1,
      }
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据料架号获取报警列表
export function getRackAlarmByRackNo(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/get-by-rackno',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据任务ID获取报警信息
export function getRackAlarmByTaskId(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/get-by-taskid',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据处理状态获取报警列表
export function getRackAlarmByHandleState(data: { data: number }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/get-by-handle-state',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 批量更新报警处理状态
export function batchUpdateHandleState(data: { data: { ids: string[]; handleState: number } }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-alarm/batch-update-handle-state',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}