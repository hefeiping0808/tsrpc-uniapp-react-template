import {randomBytes, pbkdf2Sync} from "crypto";
import { MD5Encrypt } from "./md5";
import Base64Encrypt from "./base64";
import Jwt from "../jwt";


export default class Encrypt {
    public static Jwt = Jwt;
    public static MD5 = MD5Encrypt;
    public static Base64 = Base64Encrypt;
    public static makeSalt =  () => {
        return randomBytes(3).toString('base64');
    }
    public static encryptPassword = (password: string, salt: string): string => {
        if (!password || !salt) return '';
        const _salt = Buffer.from(salt, 'base64');
        return pbkdf2Sync(password, _salt, 10000, 16, 'sha1').toString('base64');
    }
}