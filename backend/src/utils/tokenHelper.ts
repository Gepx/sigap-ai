import jwt from "jsonwebtoken";

export interface TokenPayload {
  uuid: string;
  name: string;
  email: string;
  role_id: number;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

export function generateToken(payload: TokenPayload) {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    throw new Error("Failed to generate token");
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
