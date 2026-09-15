import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

/**
 * 货架实体
 */
export interface Rack {
  /** 主键ID */
  id?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 创建人 */
  createUser?: string;
  /** 最后修改时间 */
  lastModifyTime?: Date;
  /** 最后修改人 */
  lastModifyUser?: string;
  /** 货架编号 */
  rackNo?: string;
  /** 货架面 */
  rackSide?: string;
  /** 是否启用：0-禁用，1-启用 */
  enable?: number;
  /** 是否感应：0-否，1-是 */
  inductive?: number;
  /** 端口号 */
  port?: number;
  /** IP地址 */
  ip?: string;
  /** A面储位数量 */
  aSideQty?: number;
  /** B面储位数量 */
  bSideQty?: number;
  /** 本地IP */
  localIp?: string;
  /** 本地端口 */
  localPort?: number;
}

/**
 * 设备信息DTO
 */
export interface DeviceInfoDto {
  /** 设备编号 */
  deviceNo: string;
  /** 消息 */
  message: string;
  /** ID */
  id: string;
  /** 类型 */
  type: string;
  /** 地址 */
  address: string;
  /** 端口 */
  port: string;
  /** 货架编号 */
  rackNo: string;
  /** 是否成功 */
  success: boolean;
}

/**
 * 切换测试模式
 */
export interface Test {
  /** 货架编号 */
  rackNo: string;
  /** 模式 */
  mode: number; // byte
}

/**
 * 切换测试模式请求
 */
export interface TestRequest {
  /** 货架编号 */
  rackNo: string;
  /** 1-测试模式，0-正常模式 */
  mode: number; // byte
}

/**
 * 单灯闪烁请求
 */
export interface SingleLightFlashingRequest {
  /** 货架编号 */
  rackNo: string;
  /** 闪烁次数：9999一直闪烁，0停止闪烁 */
  times: number;
  /** 储位编号 */
  addr: number;
  /** 颜色序号 */
  color: number; // byte
}

/**
 * 循环全亮/灭请求
 */
export interface LightAllLoopRequest {
  /** 货架编号 */
  rackNo: string;
  /** 颜色数目 */
  length: number; // byte
  /** 1-亮，0-灭 */
  mode: number; // byte
}

/**
 * 多彩灯亮/灭请求
 */
export interface LightOneLoopByColorRequest {
  /** 货架编号 */
  rackNo: string;
  /** 开始储位序号 */
  addr: number;
  /** 灯数 */
  ledQty: number;
  /** 颜色数目 */
  length: number; // byte
  /** 1-亮，0-灭 */
  mode: number; // byte
}

/**
 * 单灯亮/灭请求
 */
export interface LightOneLoopRequest {
  /** 货架编号 */
  rackNo: string;
  /** 开始储位序号 */
  addr: number;
  /** 灯数 */
  ledQty: number;
  /** 颜色序号 */
  color: number; // byte
  /** 1-亮，0-灭 */
  mode: number; // byte
}

/**
 * 所有灯全亮请求
 */
export interface LightAllRequest {
  /** 货架编号 */
  rackNo: string;
  /** 颜色代号 */
  color: number; // byte
}

/**
 * 所有灯全灭请求
 */
export interface DownAllRequest {
  /** 货架编号 */
  rackNo: string;
}

/**
 * 单灯亮请求
 */
export interface LightSingleRequest {
  /** 货架编号 */
  rackNo: string;
  /** 灯的地址 */
  ledAddr: number;
  /** 颜色代号 */
  color: number; // byte
}

/**
 * 单灯灭请求
 */
export interface DownSingleRequest {
  /** 货架编号 */
  rackNo: string;
  /** 灯的地址 */
  ledAddr: number;
}

/**
 * 多灯亮请求
 */
export interface LightMultiRequest {
  /** 货架编号 */
  rackNo: string;
  /** 地址列表，必须从小到大排序，单次控制672灯 */
  ledAddrs: number[];
  /** 颜色代号 */
  color: number; // byte
}

/**
 * 多灯灭请求
 */
export interface DownMultiRequest {
  /** 货架编号 */
  rackNo: string;
  /** 地址列表，必须从小到大排序，单次控制672灯 */
  ledAddrs: number[];
}

/**
 * 报警灯/蜂鸣器请求
 */
export interface AlarmLightRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面 */
  shelfSide: string;
  /** 0-红灯，1-绿灯，2-蜂鸣器 */
  color: number; // byte
}

/**
 * 取消报警灯/蜂鸣器请求
 */
export interface AlarmDownRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面 */
  rackSide: string;
  /** 0-红灯，1-绿灯，2-蜂鸣器 */
  color: number; // byte
}

/**
 * 上感应货架请求
 */
export interface UpInductiveShelfRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面 */
  shelfSide: string;
}

/**
 * 取消上感应货架请求
 */
export interface CancelUpInductiveShelfRequest {
  /** 货架编号 */
  rackNo: string;
  /** 取消发送命令包的ID */
  pkgId: string;
}

/**
 * 下感应货架请求
 */
export interface DownInductiveShelfRequest {
  /** 货架编号 */
  rackNo: string;
  /** 要下的储位列表 */
  locationAddrs: number[];
}

/**
 * 取消下感应货架请求
 */
export interface CancelDownInductiveShelfRequest {
  /** 货架编号 */
  rackNo: string;
  /** 取消发送命令包的ID */
  pkgId: string;
}

/**
 * 报警请求
 */
export interface AlarmRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面 */
  shelfSide: string;
  /** 0-单个储位；1-多个储位；2-单面 */
  mode: number;
  /** 储位数目 */
  length: number;
  /** 储位，间隔符; */
  addrs: string;
  /** 报警信息 */
  alarmMsg: string;
}

/**
 * 取消报警请求
 */
export interface AlarmCancelRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面 */
  rackSide: string;
  /** 0-单个储位；1-多个储位；2-单面 */
  mode: number;
  /** 储位数目 */
  length: number;
  /** 储位，间隔符; */
  addrs: string;
}

/**
 * 塔灯闪烁请求
 */
export interface AlarmLightFlashingRequest {
  /** 货架编号 */
  rackNo: string;
  /** 货架面：0-A；1-B；2-AB */
  rackSide: string;
  /** 0-闪烁；1-取消闪烁 */
  mode: number;
}

/**
 * 获取储位状态请求
 */
export interface GetAddrStatusRequest {
  /** 货架编号 */
  rackNo: string;
}

/**
 * 获取初始化配置信息请求
 */
export interface QueryInitInfoRequest {
  /** 货架编号 */
  rackNo: string;
}

/**
 * 感应货架反馈响应
 */
export interface InductiveShelfResponse {
  /** 货架编号 */
  shelfNo: string;
  /** 变化的储位列表 */
  addrs: number[];
  /** 命令包ID */
  pkgId: string;
}