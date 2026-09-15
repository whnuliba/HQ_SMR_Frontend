import { Alova } from '@/utils/http/alova/ids-request';

// 获取运行日志列表
export function getRackRunningLogList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-running-log/list',
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

// 导出运行日志（全量）
export function exportRackRunningLog(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-running-log/list',
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

// 根据料架号获取运行日志列表
export function getRackRunningLogByRackNo(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-running-log/get-by-rackno',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据任务ID获取运行日志
export function getRackRunningLogByTaskId(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-running-log/get-by-taskid',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据日志级别获取日志列表
export function getRackRunningLogByLogLevel(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-running-log/get-by-log-level',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 批量删除指定时间之前的日志
export function deleteLogsBefore(data: { dateTime: string }) {
  return Alova.Delete<BasicFmsResponseModel>(
    `/rack-running-log/delete-logs-before?dateTime=${data.dateTime}`,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}