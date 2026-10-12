import { Alova } from '@/utils/http/alova/ids-request';

// 接口日志 - 查询列表
export function getDispatchMessageList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/wms-message/list',
    { ...params },
    {
      meta: { isReturnNativeResponse: true },
    }
  );
}

// 归档接口日志 - 查询列表
export function getDispatchMessageHisList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/wms-message-his/list',
    { ...params },
    {
      meta: { isReturnNativeResponse: true },
    }
  );
}

// 接口日志 - 更新状态
export function updateStatus(id: string, status: number, postCount?: number) {
  return Alova.Post<BasicFmsResponseModel>(
    '/wms-message/UpdateStatus',
    {
       data:{
           id,
          status,
          postCount,
       }
    },
    {
      meta: { isReturnNativeResponse: true },
    }
  );
}
