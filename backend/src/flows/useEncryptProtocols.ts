import {WsClient, WsServer} from "tsrpc";
import {ServiceType} from "../shared/protocols/serviceProto";

// 加密
const encrypt = (buf: Uint8Array): Uint8Array => {
    for (let i = 0; i < buf.length; ++i) {
        buf[i] -= 1;
    }
    return buf;
}

// 解密
const decrypt = (buf: Uint8Array): Uint8Array => {
    for (let i = 0; i < buf.length; ++i) {
        buf[i] += 1;
    }
    return buf;
}

export const useEncryptProtocols = (ws: WsClient<ServiceType> | WsServer<ServiceType> | any) => {
    // 发送前加密
    ws.flows.preSendDataFlow.push((v: any) => {
        if(v.data instanceof Uint8Array){
            v.data = encrypt(v.data);
        }
        return v;
    });
    // 接收前解密
    ws.flows.preRecvDataFlow.push((v: any) => {
        if(v.data instanceof Uint8Array){
            v.data = decrypt(v.data);
        }
        return v;
    })
}