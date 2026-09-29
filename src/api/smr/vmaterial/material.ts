import { Alova } from '@/utils/http/alova/ids-request';

// 获取物料信息列表
export function getMaterialList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/get-materials',
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

// 导出物料信息（全量）
export function exportMaterialList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/get-materials',
    {
      ...params,
      requestData: {
        ...params.requestData,
      }
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
