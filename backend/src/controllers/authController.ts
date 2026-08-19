import { Request, Response } from "express";
import { User, IUser } from "../models/User.js";
import { generateToken, setAuthCookie, clearAuthCookie } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logAuditAction } from "../middleware/auditLogger.js";

// @desc    Register a new investigator/user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, badgeNumber, role, department } = req.body;

    if (!name || !email || !password || !badgeNumber) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, password, badgeNumber.",
      });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { badgeNumber }],
    });

    if (userExists) {
      res.status(400).json({
        success: false,
        message:
          userExists.email === email.toLowerCase()
            ? "Email already registered in system."
            : "Badge number already assigned to another investigator.",
      });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      badgeNumber,
      role: role || "investigator",
      department: department || "Forensics & Intelligence Unit",
    });

    const token = generateToken(user);
    setAuthCookie(res, token);

    await logAuditAction({
      user,
      action: "USER_REGISTERED",
      targetType: "USER",
      targetId: user._id.toString(),
      details: { role: user.role, badgeNumber: user.badgeNumber },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Security profile initialized.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badgeNumber: user.badgeNumber,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration.",
    });
  }
};

// @desc    Login user & issue JWT
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
      return;
    }

    // Find user with password included
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { badgeNumber: email.trim() }],
    }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Badge or email not recognized.",
      });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Authentication failed.",
      });
      return;
    }

    if (user.status === "suspended") {
      res.status(403).json({
        success: false,
        message: "Account suspended. Access revoked.",
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);
    setAuthCookie(res, token);

    await logAuditAction({
      user,
      action: "USER_LOGIN",
      targetType: "AUTH",
      targetId: user._id.toString(),
      details: { role: user.role, loginTime: new Date() },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badgeNumber: user.badgeNumber,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during login.",
    });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user) {
    await logAuditAction({
      user: req.user,
      action: "USER_LOGOUT",
      targetType: "AUTH",
      targetId: req.user._id.toString(),
      ipAddress: req.ip,
    });
  }

  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Session terminated.",
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      badgeNumber: req.user.badgeNumber,
      role: req.user.role,
      department: req.user.department,
      avatar: req.user.avatar,
      status: req.user.status,
      lastLogin: req.user.lastLogin,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  try {
    const { name, department, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        badgeNumber: user.badgeNumber,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for case assignment
// @route   GET /api/auth/users
// @access  Private (Admin, Investigator)
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({ status: "active" })
      .select("name email badgeNumber role department avatar")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
