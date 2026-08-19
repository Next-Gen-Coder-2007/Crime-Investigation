import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User.js";

// Extend Express Request interface to include user and multer file properties
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  file?: any;
  files?: any;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // 1. Check HTTP-Only Cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Header Bearer token
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "intelboard_ai_super_secret_jwt_key_2026_investigation";
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authentication failed. User account not found.",
      });
      return;
    }

    if (user.status === "suspended") {
      res.status(403).json({
        success: false,
        message: "Your account is suspended. Contact system administrator.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session token. Please sign in again.",
    });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks clearance for this action. Required: [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
};
