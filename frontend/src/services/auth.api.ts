import axios from "../utils/axios.ts";
import { apiHandler } from "../utils/apiHandler.ts";
import type { LoginCredentials, RegisterData } from "../types/auth";

export const loginAPI = (credentials: LoginCredentials) =>
  apiHandler(() =>
    axios.post("/auth/login", credentials).then((res) => res.data),
  );

export const registerAPI = (userData: RegisterData) =>
  apiHandler(() =>
    axios.post("/auth/register", userData).then((res) => res.data),
  );

export const logoutAPI = () =>
  apiHandler(() => axios.post("/auth/logout").then((res) => res.data));

export const getMeAPI = () =>
  apiHandler(() => axios.get("/auth/me").then((res) => res.data));

export const forgotPasswordAPI = (email: string) =>
  apiHandler(() =>
    axios.post("/auth/forgot-password", { email }).then((res) => res.data),
  );

export const resetPasswordAPI = (token: string, newPassword: string) =>
  apiHandler(() =>
    axios
      .post(`/auth/reset-password/${token}`, { newPassword })
      .then((res) => res.data),
  );
