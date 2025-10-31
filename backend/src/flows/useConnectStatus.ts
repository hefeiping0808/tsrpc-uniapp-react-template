import { WsClient, WsServer } from "tsrpc";
import { ServiceType } from "../shared/protocols/serviceProto";

export const useConnectStatus = (server: WsServer<ServiceType>) => {
    // 连接之后处理
    server.flows.postConnectFlow.push(v => {
        // console.log('新链接', v);

        return v;
    });
    // 断线之后处理
    server.flows.postDisconnectFlow.push(v => {
        return v;
    });
}