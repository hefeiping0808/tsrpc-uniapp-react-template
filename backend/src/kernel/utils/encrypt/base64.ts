const key: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export default class Base64Encrypt {
    /** @description public method for encoding */
    public static encode(input: string): string {
        let output: string = "";
        let chr1: number, chr2: number, chr3: number, enc1: number, enc2: number, enc3: number, enc4: number;
        let i: number = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                key.charAt(enc1) + key.charAt(enc2) +
                key.charAt(enc3) + key.charAt(enc4);
        }
        return output;
    }

    /** @description public method for decoding */
    public static decode(input: string): string {
        let output: string = "";
        let chr1: number, chr2: number, chr3: number;
        let enc1: number, enc2: number, enc3: number, enc4: number;
        let i: number = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = key.indexOf(input.charAt(i++));
            enc2 = key.indexOf(input.charAt(i++));
            enc3 = key.indexOf(input.charAt(i++));
            enc4 = key.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            // 如果等于0的话 灾难堪比特殊字符 在解密的时候去掉就行 没有出现过chr为0的
            if (enc3 != 64 && chr2 !== 0) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64 && chr3 !== 0) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    }

    /** @description private method for UTF-8 encoding */
    private static _utf8_encode(content: string): string {
        content = content.replace(/\r\n/g,"\n");
        let str: string = "";
        for (let n = 0; n < content.length; n++) {
            let c = content.charCodeAt(n);
            if (c < 128) {
                str += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                str += String.fromCharCode((c >> 6) | 192);
                str += String.fromCharCode((c & 63) | 128);
            } else {
                str += String.fromCharCode((c >> 12) | 224);
                str += String.fromCharCode(((c >> 6) & 63) | 128);
                str += String.fromCharCode((c & 63) | 128);
            }

        }
        return str;
    }

    /** @description private method for UTF-8 decoding */
    private static _utf8_decode(content: string): string {
        let str: string = "";
        let i: number = 0;
        let c: number, c1: number, c2: number, c3: number = 0;
        while ( i < content.length ) {
            c = content.charCodeAt(i);
            if (c < 128) {
                str += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = content.charCodeAt(i+1);
                str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = content.charCodeAt(i+1);
                c3 = content.charCodeAt(i+2);
                str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return str;
    }
}