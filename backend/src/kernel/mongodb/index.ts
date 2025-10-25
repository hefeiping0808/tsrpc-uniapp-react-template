import { Collection, Db, MongoClient, OptionalId } from "mongodb";
import DBCollectionType from "./model/user/DBCollectionType";



export class MongoDB {
  constructor(private readonly uri: string) {
  }

  private _client: MongoClient = null!;

  public get client(): MongoClient {
    return this._client
  };

  public get db(): Db {
    return this._client.db()
  };

  public async start(): Promise<void> {
    return new Promise<any>(async (resolve, reject) => {
      this._client = await new MongoClient(this.uri, {
        connectTimeoutMS: 10000,         // 连接超时时间为 10 秒
        socketTimeoutMS: 45000,          // 读/写操作超时时间为 45 秒
        serverSelectionTimeoutMS: 5000,  // 选择服务器超时时间为 5 秒

      }).connect();
      console.log(`Mongodb 连接完成`);
      resolve(true);
    })
  }

  public collection<T extends keyof DBCollectionType>(col: T): Collection<OptionalId<DBCollectionType[T]>> {
    return this._client.db().collection(col);
  }

  public createClient() {
    return new MongoClient(this.uri)
  }
}

