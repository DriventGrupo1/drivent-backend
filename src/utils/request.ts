import axios from 'axios';
import { requestError } from '@/errors';

async function get<type>(url: string, configs?: type) {
  try {
    const result = await axios.get(url, configs);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

async function post<Type>(url: string, params: Type) {
  try {
    const result = await axios.post(url, params);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

export const request = {
  get,
  post,
};
