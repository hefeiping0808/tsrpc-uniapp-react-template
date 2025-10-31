import * as path from "path";
import { HttpServer, WsServer } from "tsrpc";
import { serviceProto } from "./shared/protocols/serviceProto";
import { ENV } from "./config";
import { MongoDB } from "./kernel/mongodb";
import { snowflakeIdv1 } from "./kernel/utils/snowFlake";

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

export const mongo = new MongoDB(ENV.mongo)
export const snowFlake = new snowflakeIdv1({ workerId: 1 })

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