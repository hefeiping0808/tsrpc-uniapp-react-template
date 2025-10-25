import { HttpServer } from "tsrpc";
import { ServiceType } from "../protocols/serviceProto";
import { BaseRequest } from "../protocols/base";
import Encrypt from "../../kernel/utils/encrypt";
import { strict } from "assert";

// ip访问频次对象：
export const ipLimitMap: {
  [key: string]: string[]
} = {}

export const useAuthentication = (server: HttpServer<ServiceType>) => {
  server.flows.preApiCallFlow.push(async call => {
    let req = call.req as BaseRequest;
    console.log(call.service.name);
    if (['user/UserUpdate', 'user/Login', 'user/UserReadAction'].includes(call.service.name)) {
      const _user = Encrypt.Jwt.verify(req.__token as string)
      console.log(_user);

      if (!_user) {
        call.error('token无效');
        return
      }
      let ipList: string[] | undefined = ipLimitMap[_user.username]
      if (ipList == undefined) return call;

      if (ipList.includes(call.conn.ip)) {
        call.error('IP 已被拉黑');
        return undefined
      }

    }

    const needRole = call.service.conf?.needRole;
    // 不需要权限的路由
    if (needRole.length === 0) return call;

    // 不带token无权访问
    if (!req.__token) {
      call.error('缺少 token');
      return undefined;
    }

    // @todo 验证 __token 合法性
    // ...

    return call;
  })
}
