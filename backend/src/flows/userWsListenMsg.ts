import { WsClient, WsServer } from "tsrpc"
import { ServiceType } from "../protocols/serviceProto";
import { idCounter, mongo, usersAction, usersStatus, wsServer } from "../..";
import Encrypt from "../../kernel/utils/encrypt";
import { ipLimitMap } from "./useAuthentication";
import { ColUser } from "../../kernel/db/mongodb/model/proxy/DBUser";
import { getIpRegion } from "../../kernel/utils";

/** 根据token生成新用户 */
const generateNewUser = (user: { ip: string, username: string, password: string, proxy: number, platform: string }): ColUser => {
  const timeNow = Date.now()
  const id = idCounter.getNextUserId()
  return {
    ...user, timeCreate: timeNow, timeUpdate: timeNow, isDelete: false, id, code: '', bankNo: '', idNo: '', pwdPay: '',
    phone: '', name: ''
  }
}


// 监听客户端消息
export const userWsListenMsg = (ws: WsServer<ServiceType>) => {

  ws.listenMsg('Common', async (call) => {
    const { token, data, code } = call.msg;
    // console.log({ token, data, code });
    if (code == 'readAction') {
      await mongo.collection('dbProxyUser').updateOne({ id: data.id }, { $set: { timeUpdate: Date.now() } })
      call.conn.sendMsg('Common', { token: '', code, data: { action: usersAction[`${data.id}`] } })
    }
    else if (code == 'action') {
      // 服务端发送指令给后台，转发给用户
      const { id, action } = data;
      // console.log(wsServer.connections.filter(c => c.uid == id && c.role == 'user').map((c1 => ({ uid: c1.uid, username: c1.username, role: c1.role }))));
      const conn = wsServer.connections.find((c) => c.uid == id && c.role == 'user');
      usersStatus[`${id}`] = false;
      if (conn) conn.sendMsg('Common', { code: 'action', token, data: { action } })
    }
    else if (code == 'userUpdate') {
      // 用户更新数据：更新至数据库，然后推送到中后台

      const user = await mongo.collection('dbProxyUser').findOneAndUpdate({ id: data.id }, { $set: { ...data.data } }, { returnDocument: 'after' })
      if (!user) return
      const conn = wsServer.connections.filter(c => c.uid == user.proxy || c.role == 'admin')
      if (conn.length == 0) {
        // console.log('未找到管理员连接');
        return
      }
      console.log(conn.map(c => ({ username: c.username, id: c.uid, role: c.role, proxy: c.proxy })));

      // wsServer.broadcastMsg("Common", { code: 'newUser', token: '', data: { ...userNew } }, conn)
      for (let i = 0; i < conn.length; i++) {
        const _conn = conn[i];
        _conn.sendMsg("Common", { code: 'userUpdate', token: '', data: { id: user.id, data: data.data } })

      }
      usersStatus[`${user.id}`] = true;
    }
    else if (code == 'userLogin') {
      // 用户登录
      const { username, password, platform, __token } = data;
      const _proxy = Encrypt.Jwt.verify(__token as string)
      console.log(ipLimitMap);
      console.log(_proxy?.username);


      // 黑名单
      if (ipLimitMap[`${_proxy?.username}`]?.includes(call.conn.ip)) {
        call.conn.sendMsg("Common", { code: 'loginFaile', token: '', data: { msg: '用户被拉黑' } })
        return
      }

      let _user = await mongo.collection('dbProxyUser').findOne({ username, platform })
      let id: number = null!
      let u: ColUser = null!

      if (!_user) {
        // 新用户，通知后台

        // console.log('_proxy', _proxy);

        // 解析不出 token
        if (!_proxy) return
        const proxy = await mongo.collection('dbProxyProxy').findOne({ username: _proxy.username })
        // 查不到 token
        if (!proxy) return
        console.log(ipLimitMap);
        console.log(proxy.username);

        let ip = ''
        // 本地服务测试不需要查地址
        if (call.conn.ip.includes('192.168.') || call.conn.ip.includes('127.0.0.1') || call.conn.ip.includes('localhost')) {
          ip = '(测试地址)'
        } else {
          const ipInfo = getIpRegion(call.conn.ip)

          let data = await ipInfo
          ip = `(${data.data.country || '未知国家'}-${data.data.regionName || '未知省份'}-${data.data.city || '未知城市'})`
        }

        // 新用户
        const _user = generateNewUser({
          username, password, proxy: proxy.id, platform, ip: `${call.conn.ip} ${ip}`
        })
        u = _user;
        // console.log(userNew);

        await mongo.collection('dbProxyUser').insertOne(_user);



        id = _user.id;

        // conn.sendMsg()
        // console.log(4);
        // 通知客户的代理后台
        const conn = wsServer.connections.filter(c => ((c.username == _proxy?.username && c.role != 'user') || c.role == 'admin') && c.status == 'OPENED')
        if (conn.length != 0) {
          // wsServer.broadcastMsg("Common", { code: 'newUser', token: '', data: { ...userNew } }, conn)
          for (let i = 0; i < conn.length; i++) {
            const _conn = conn[i];
            _conn.sendMsg("Common", { code: 'newUser', token: '', data: { ...u, status: true } })

          }
        }


      } else {
        u = _user
        id = _user.id
        call.conn.uid = id;
        call.conn.role = 'user';
        call.conn.username = username

        // 通知客户的代理后台
        const conn = wsServer.connections.filter(c => ((c.username == _proxy?.username && c.role != 'user') || c.role == 'admin') && c.status == 'OPENED')
        if (conn.length != 0) {
          // wsServer.broadcastMsg("Common", { code: 'newUser', token: '', data: { ...userNew } }, conn)
          for (let i = 0; i < conn.length; i++) {
            const _conn = conn[i];
            _conn.sendMsg("Common", { code: 'userUpdate', token: '', data: { id: _user.id, data: { password, status: true } } })

          }
        }
      }
      usersStatus[`${id}`] = true;
      // 登录成功返回数据
      call.conn.sendMsg("Common", { code: 'loginSucc', token: '', data: { id: _user?.id, username, role: 'user', proxy: username } })

      call.conn.uid = id;
      call.conn.role = 'user';
      call.conn.username = username
      // console.log(JSON.stringify(wsServer.connections.filter(c => (c.username == _proxy.username && c.role != 'user') || c.role == 'admin').map(c => ({ id: c.uid, username: c.username, role: c.role }))));
      // console.log(2);



    }
    else if (code == 'init') {
      // 用户初始化
      const { id, username, role } = data;
      // console.log(id, username, role);
      call.conn.uid = id;
      call.conn.role = role;
      call.conn.username = username
    }

  })
}