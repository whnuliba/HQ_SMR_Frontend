import { Alova } from '@/utils/http/alova/ids-request';

// 下架储位DTO
export interface RackLocationDto {
  rackId: string;
  cellList: string[];
}

// 下架请求
export interface DownRackRequest {
  rackCmd: string;
  rackClass: RackLocationDto[];
  lightColor?: number;
  outTime?: number;
  userId?: string;
  timestamp?: string;
  sessionId?: string;
}

// 下架响应
export interface DownRackResponse {
  code: number;
  rackId: string;
  cellId: string;
  message: string;
  timestamp: string;
  sessionId: string;
}

// 下架接口
export function downRackCMD(data: DownRackRequest) {
  return Alova.Post<BasicFmsResponseModel>(
    '/DownRackCMD',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
