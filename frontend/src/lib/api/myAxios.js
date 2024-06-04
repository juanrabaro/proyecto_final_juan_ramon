import axios from 'axios';

let myAxios;

console.log(import.meta.env.VITE_MODE);
console.log(import.meta.env.VITE_DESPLIEGUE_API_URL);
console.log(import.meta.env.VITE_LOCAL_API_URL);


if (import.meta.env.VITE_MODE === "produccion") {
  myAxios = axios.create({
    baseURL: import.meta.env.VITE_DESPLIEGUE_API_URL,
    withCredentials: true,
  })
} else {
  myAxios = axios.create({
    baseURL: import.meta.env.VITE_LOCAL_API_URL,
    withCredentials: true,
  })
}

export default myAxios;