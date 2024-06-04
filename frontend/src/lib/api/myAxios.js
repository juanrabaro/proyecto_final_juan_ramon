import axios from 'axios';

let myAxios;

if (import.meta.env.MODE === "produccion") {
  myAxios = axios.create({
    baseURL: import.meta.env.DESPLIEGUE_API_URL,
    withCredentials: true,
  })
} else {
  myAxios = axios.create({
    baseURL: import.meta.env.LOCAL_API_URL,
    withCredentials: true,
  })
}

export default myAxios;