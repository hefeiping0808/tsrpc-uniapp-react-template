// 生成随机字符串
export const randomString = (length: number) => {
    const str: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: string = '';
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}
// 生成随机数字字符串
export const randomNumberString = (length: number) => {
    const str: string = '0123456789';
    let result: string = '';
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}
// 生成随机大写字母字符串
export const randomUppercaseString = (length: number) => {
    const str: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: string = '';
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}
// 生成指定格式化的日期字符串+随机数字字符串
export const randomDateString = (length: number) => {
    let date = new Date();
    let year: string = date.getFullYear() < 10 ? `0${date.getFullYear()}` : date.getFullYear().toString();
    year = year.slice(-2);
    let mouth = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let milliseconds = date.getMilliseconds();
    let o: any = { year, mouth, day, hours, minutes, seconds, milliseconds };
    let result: string = "";
    for (let k in o) {
        if (k != "milliseconds")
            result += o[k] < 10 ? `0${o[k]}` : o[k].toString();
        else
            result += o[k] < 10 ? `00${o[k]}` : o[k] < 100 ? `0${o[k]}` : o[k];
    }
    return result + randomNumberString(length);
}