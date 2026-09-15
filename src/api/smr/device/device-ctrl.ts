import { Alova } from '@/utils/http/alova/ids-request';
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
// 通用响应类型
export interface ResponseEntity<T> {
  code: number;
  msg: string;
  data: T;
}

// 请求包装类型
export interface RequestData<T> {
  data: T;
}

export function getAllRackNodes() {
  return Alova.Post<ResponseEntity<Rack[]>>('/rack-node/all-racknodes');
}

/**
 * 切换测试模式
 */
export function testMode(data: RequestData<Test>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/Test', data);
}

/**
 * 单灯闪烁
 */
export function singleLightFlashing(data: RequestData<SingleLightFlashingRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/SingleLightFlashing', data);
}

/**
 * 循环全亮、灭
 */
export function lightAllLoop(data: RequestData<LightAllLoopRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightAllLoop', data);
}

/**
 * 多彩灯亮、灭
 */
export function lightOneLoopByColor(data: RequestData<LightOneLoopByColorRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightOneLoopByColor', data);
}

/**
 * 单灯亮、灭
 */
export function lightOneLoop(data: RequestData<LightOneLoopRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightOneLoop', data);
}

/**
 * 所有灯全亮
 */
export function lightAll(data: RequestData<LightAllRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightAll', data);
}

/**
 * 所有灯全灭
 */
export function downAll(data: RequestData<DownAllRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/DownAll', data);
}

/**
 * 单灯亮
 */
export function lightSingle(data: RequestData<LightSingleRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightSingle', data);
}

/**
 * 单灯灭
 */
export function downSingle(data: RequestData<DownSingleRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/DownSingle', data);
}

/**
 * 多灯亮
 */
export function lightMulti(data: RequestData<LightMultiRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/LightMulti', data);
}

/**
 * 多灯灭
 */
export function downMulti(data: RequestData<DownMultiRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/DownMulti', data);
}

/**
 * 大灯亮，蜂鸣器响
 */
export function alarmLight(data: RequestData<AlarmLightRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/AlarmLight', data);
}

/**
 * 大灯灭，蜂鸣器停
 */
export function alarmDown(data: RequestData<AlarmDownRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/AlarmDown', data);
}

/**
 * 获取初始化配置信息
 */
export function queryInitInfo(data: RequestData<QueryInitInfoRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/QueryInitInfo', data);
}

/**
 * 取消报警
 */
export function alarmCancel(data: RequestData<AlarmCancelRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/AlarmCancel', data);
}

/**
 * 塔灯闪烁
 */
export function alarmLightFlashing(data: RequestData<AlarmLightFlashingRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/AlarmLightFlashing', data);
}

/**
 * 大灯亮，蜂鸣器报警
 */
export function getAlarmLightToLight(data: RequestData<AlarmDownRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/GetAlarmLightToLight', data);
}

/**
 * 获取储位状态
 */
export function getAddrStatus(data: RequestData<GetAddrStatusRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/GetAddrStatus', data);
}

/**
 * 上感应货架
 */
export function upInductiveShelf(data: RequestData<UpInductiveShelfRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/UpInductiveShelf', data);
}

/**
 * 取消上感应货架
 */
export function cancelUpInductiveShelf(data: RequestData<CancelUpInductiveShelfRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/CancelUpInductiveShelf', data);
}

/**
 * 下感应货架
 */
export function downInductiveShelf(data: RequestData<DownInductiveShelfRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/DownInductiveShelf', data);
}

/**
 * 取消下感应货架
 */
export function cancelDownInductiveShelf(data: RequestData<CancelDownInductiveShelfRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/CancelDownInductiveShelf', data);
}

/**
 * 报警
 */
export function alarm(data: RequestData<AlarmRequest>) {
  return Alova.Post<ResponseEntity<object>>('/deviceCtrl/Alarm', data);
}