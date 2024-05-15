import { myAxios } from "./myAxios.js"

export const getCronoTasks = (token) => myAxios.get('/crono-tasks', {
  headers: {
    Authorization: token
  }
})

export const getCronoTaskById = (id, token) => myAxios.get(`/crono-task/${id}`, {
  headers: {
    Authorization: token
  }
})

export const addCronoTask = (task, token) => myAxios.post('/add-crono-task', task, {
  headers: {
    Authorization: token
  }
})

export const updateCronoTask = (task, token) => myAxios.put(`/update-crono-task/${task.id}`, task, {
  headers: {
    Authorization: token
  }
})

export const deleteCronoTask = (id, token) => myAxios.delete(`/delete-crono-task/${id}`, {
  headers: {
    Authorization: token
  }
})
