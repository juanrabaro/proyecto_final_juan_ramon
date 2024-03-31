import axios from 'axios';

const myAxios = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
})

export const register = (user) => myAxios.post('/register', user)

export const login = (user) => myAxios.post('/login', user)

export const profile = (user) => myAxios.post('/profile', user)

export const verifyToken = (token) => myAxios.post('/verify-token', { token })