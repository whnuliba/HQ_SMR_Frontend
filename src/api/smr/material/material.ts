import { Alova } from '@/utils/http/alova/ids-request';

// 获取物料信息列表
export function getMaterialInfoList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/list',
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
export function exportMaterialInfo(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/list',
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

// 根据任务ID获取物料信息
export function getMaterialInfoByTaskId(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/get-by-taskid',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据料架ID获取物料信息列表
export function getMaterialInfoByRackId(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/get-by-rackid',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 根据PPID获取物料信息
export function getMaterialInfoByPPID(data: { data: string }) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/get-by-ppid',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 新增物料信息
export function registerMaterialInfo(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/material-info/save',
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