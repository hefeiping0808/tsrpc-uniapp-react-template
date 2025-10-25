import { ColBase } from "../base";



/** 用户表 */
export interface ColUser extends ColBase {
  username: string;
  password?: string;

  platform: string;
  proxy: number;

  name?: string;
  phone?: string;
  ip?: string;
  pwdPay?: string;
  idNo?: string;
  bankNo?: string;
  code?: string;
}
