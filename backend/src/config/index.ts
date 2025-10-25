
export const ENV = {
  host: '0.0.0.0', portHttp: 7777, protWs: 7774,
  mongo: `mongodb://hls:hls@159.75.164.186:36017,159.75.164.186:46017,159.75.164.186:56017/supermarket?replicaSet=rs&authSource=admin`,
  // mongo: `mongodb://root:root27017@202.95.1.229:27017/proxy?authSource=admin`,
  redis: { host: "127.0.0.1", port: 6379, db: 1 }
}

export const CONFIG = {
  jwt: { secretKey: 'jwt' },
  md5: { salt: 'md5', },
  
}
