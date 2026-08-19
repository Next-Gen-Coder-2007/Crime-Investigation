export type UserRole = "admin" | "investigator" | "viewer";
export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  badgeNumber: string;
  role: UserRole;
  department: string;
  avatar?: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  badgeNumber: string;
  role?: UserRole;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}
