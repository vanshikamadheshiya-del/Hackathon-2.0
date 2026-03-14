import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { User } from '../types/user';

export interface GetUsersResponse {
  message: string;
  totalUsers: number;
  users: User[];
}

export const getUsersAPI = (): Promise<GetUsersResponse> =>
  apiHandler(() => axios.get('/user').then(res => res.data));

export const getUserByIdAPI = (id: string): Promise<User> =>
  apiHandler(() => axios.get<{ user: User }>(`/user/${id}`).then(res => res.data.user));

export const createUserAPI = (data: { name: string; email: string }): Promise<User> =>
  apiHandler(() => axios.post<{ user: User }>('/user', data).then(res => res.data.user));

export const updateUserAPI = (id: string, data: { name: string; email: string }): Promise<User> =>
  apiHandler(() => axios.put<{ user: User }>(`/user/${id}`, data).then(res => res.data.user));

export const deleteUserAPI = (id: string): Promise<void> =>
  apiHandler(() => axios.delete(`/user/${id}`).then(() => undefined));
