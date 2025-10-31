import { WsClient, WsServer } from "tsrpc"
import { ServiceType } from "../shared/protocols/serviceProto";
import { wsServer } from "..";
import Encrypt from "../kernel/utils/encrypt";
import { ipLimitMap } from "./useAuthentication";
import { ColUser } from "../kernel/mongodb/model/user/DBUser";


/** 根据token生成新用户 */
const generateNewUser = (user: { ip: string, username: string, password: string, proxy: number, platform: string }): ColUser => {
  const timeNow = Date.now()
  const id = 0
  return {
    ...user, timeCreate: timeNow, timeUpdate: timeNow, isDelete: false, id, code: '', bankNo: '', idNo: '', pwdPay: '',
    phone: '', name: ''
  }
}


// 监听客户端消息
export const userWsListenMsg = (ws: WsServer<ServiceType>) => {

  // ws.listenMsg('Common', async (call) => {

  // })
}