import request, { IResponse, IPagnationResponse } from '@/lib/request';
import { VERIFICATION_CODE_SCENE } from '@/common/const';

export interface IUserResponse {
  _id: string;
  id: string;
  address: string;
  nickname: string;
  cover: string;
  avatar: string;
  bio: string;
  email?: string;
  twitter: string;
  github: string;
  website: string;
  external: any;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export function getUsers(page = 1, pageSize = 10, filter = '', sort = '') {
  return request<IResponse<IPagnationResponse<IUserResponse>>>(
    `/api/v2/user?include=projects&page=${page}&pageSize=${pageSize}&filter=${encodeURIComponent(
      filter,
    )}&sort=${sort}`,
  );
}

export function getUserByAddress(address: string) {
  return request<IResponse<IUserResponse>>(`/api/v2/user/${address}`);
}

export function updateUser(address: string, data: any) {
  return request<IResponse<IUserResponse>>(`/api/v2/user/${address}`, {
    method: 'PUT',
    data,
    showError: true,
    showSuccess: true,
    successMsg: 'Update Successfully',
  });
}

export function getUsersVerifyEmailCode(email: string) {
  return request<IResponse<{}>>(
    `/api/v2/verification-code?email=${email}&scene=${VERIFICATION_CODE_SCENE.VERIFY_EMAIL}`,
  );
}

export function linkTwitter(twitter: string) {
  return request<IResponse<IUserResponse>>(`/api/v2/user/link/twitter`, {
    method: 'POST',
    data: {
      twitter,
    },
    showError: true,
    showSuccess: true,
    successMsg: 'Twitter link successfully',
  });
}
