import * as path from "path";
import { HttpServer, WsServer } from "tsrpc";
import { serviceProto } from "./shared/protocols/serviceProto";
import { ENV } from "./config";

declare module 'tsrpc' {
  export interface BaseConnection {
      // 自定义的新字段
      uid: number;
      role: string;
      username: string;
  }
}

// http服务
const httpServer = new HttpServer(serviceProto, {
  port: ENV.portHttp,
  json: true,
  logLevel: 'info'
});

// websocket服务
export const wsServer = new WsServer(serviceProto, {
  port: ENV.protWs, json: true
})

// Initialize before server start
async function init() {
    // Auto implement APIs
    await httpServer.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)
};

// Entry function
async function main() {
    await init();
    await httpServer.start();
};
main();