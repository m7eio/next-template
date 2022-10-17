import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { extend } from 'umi-request';
import Event from '@/utils/event';

const request = extend({ timeout: 0 });

request.interceptors.request.use(
  (url, options) => {
    return {
      url,
      options: {
        successMsg: 'Successed',
        showError: false,
        showSuccess: false,
        ...options,
      },
    };
  },
  { global: true },
);

const toastError = debounce(toast.error, 300);
const toastSuccess = debounce(toast.success, 300);

request.interceptors.response.use(async (response, options) => {
  if (response.status >= 200 && response.status < 300) {
    const data = await response.clone().json();
    if (data.status === 'fail' && options.showError) {
      toastError(data.msg);
    } else if (data.status === 'success' && options.showSuccess) {
      toastSuccess(options.successMsg || data.msg);
    }
    return response.json();
  }

  if (response.status === 403) {
    // No permission
    Event.emit('web3-wallet-connect');
  }

  if (options.showError) {
    const data = await response.clone().json();
    toastError(data.msg || 'Unknown Error');
  }
  return response;
});

export interface IResponse<T> {
  data: T;
  status: 'success' | 'fail';
  code: number;
  msg: string;
}

export interface IPagnationResponse<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default request;
