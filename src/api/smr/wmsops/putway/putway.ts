import { Alova } from '@/utils/http/alova/ids-request';

// 上架请求
export interface UpRackRequest {
  operateType?: string;
  rackCmd: string;
  rackId: string;
  rackSide?: string;
  lightColor?: number;
  outTime?: number;
  ppid?: string;
  compPn?: string;
  description?: string;
  qty?: number;
  customerPn?: string;
  vendorCode?: string;
  dateCode?: string;
  lotCode?: string;
  orgCode?: string;
  no09?: string;
  gupn?: string;
  userId?: string;
  timestamp?: string;
  sessionId?: string;
}

// 上架响应
export interface UpRackResponse {
  code: number;
  rackId: string;
  cellId: string;
  message: string;
  timestamp: string;
  sessionId: string;
}

// 上架接口
export function upRackCMD(data: UpRackRequest) {
  return Alova.Post<BasicFmsResponseModel>(
    '/UpRackCMD',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
