import {createHash} from "crypto";

export const MD5Encrypt = (content: string): string => {
    return createHash('md5')
        .update(JSON.stringify(content), 'utf-8')
        .digest('hex')
        .toString()
}