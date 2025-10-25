import jwt from 'jsonwebtoken';

interface JwtPayload {
  [key: string]: any;
}

export default class Jwt {
  public static readonly SECRET_KEY = "default_secret_key";

  public static sign(payload: JwtPayload, secretKey: string = Jwt.SECRET_KEY, expiresIn: number = 30 * 24 * 60 * 60 * 1000): string {
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  public static verify(token: string, secretKey: string = Jwt.SECRET_KEY): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}