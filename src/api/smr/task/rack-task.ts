import { Alova } from '@/utils/http/alova/ids-request';

//获取获取任务
export function getRackTask(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/task/list',
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

//获取获取任务
export function getRackTaskHis(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/taskhis/list',
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

//获取获取任务
export function getRackCancelTask(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/taskcancel/list',
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

//取消任务任务
export function cancelRackTask(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/task/CancelTask',
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
//强制完成任务任务
export function forceCompleteTask(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/task/ForceCompleteTask',
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