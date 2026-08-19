import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/User.js";

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || "intelboard_ai_super_secret_jwt_key_2026_investigation";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      badgeNumber: user.badgeNumber,
    },
    secret,
    { expiresIn: expiresIn as any }
  );
};

export const setAuthCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

export const clearAuthCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    expires: new Date(0),
    path: "/",
  });
};
