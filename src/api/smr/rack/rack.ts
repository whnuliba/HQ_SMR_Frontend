import { Alova } from '@/utils/http/alova/ids-request';

//获取获取任务
export function getRack(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/rack-node/list',
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

export function registerRack(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/location/Registration',
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

export function getLocations(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/location/list',
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