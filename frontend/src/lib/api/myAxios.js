import axios from 'axios';

export const myAxios = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
})