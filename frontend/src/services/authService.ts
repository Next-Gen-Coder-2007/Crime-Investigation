import { apiClient } from "./api";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types/auth";

export const authService = {
  // Login with credentials
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      data: credentials,
    });
  },

  // Register new investigator
  async register(data: RegisterData): Promise<AuthResponse> {
    return await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      data,
    });
  },

  // Logout current user
  async logout(): Promise<{ success: boolean; message: string }> {
    return await apiClient<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    });
  },

  // Get current user profile
  async getMe(): Promise<{ success: boolean; user: User }> {
    return await apiClient<{ success: boolean; user: User }>("/auth/me", {
      method: "GET",
    });
  },

  // Get all active users
  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    return await apiClient<{ success: boolean; users: User[] }>("/auth/users", {
      method: "GET",
    });
  },
};
