
export interface ColBase {
  id: number;
  timeCreate: number;
  timeUpdate: number;
  isDelete?: boolean;
}

// 性别： F 女 M 男 U 未知
export type TypeGender = 'F' | 'M' | 'U';

// 地址
export interface IAddress {
  sheng: string;
  shi: string;
  qu: string;
  xian?: string;
  detail?: string;
  phone: string;
  isDefault: boolean;
}

// 定位
export interface ILocation{
  long: number;
  lat: number;
}
