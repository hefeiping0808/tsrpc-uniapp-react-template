export interface BaseRequest {
  __token?: string; 
}

export interface BaseResponse {
  code?: number; msg?: string; data?: any;
}

export interface BaseConf {
  needLogin?: boolean;
  needRoles?: string[];
}