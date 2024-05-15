import { myAxios } from "./myAxios.js"

export const getTimerTasks = (token) => myAxios.get('/timer-tasks', {
  headers: {
    Authorization: token
  }
})

export const getTimerTaskById = (id, token) => myAxios.get(`/timer-task/${id}`, {
  headers: {
    Authorization: token
  }
})

export const addTimerTask = (task, token) => myAxios.post('/add-timer-task', task, {
  headers: {
    Authorization: token
  }
})

export const updateTimerTask = (task, token) => myAxios.put(`/update-timer-task/${task.id}`, task, {
  headers: {
    Authorization: token
  }
})

export const deleteTimerTask = (id, token) => myAxios.delete(`/delete-timer-task/${id}`, {
  headers: {
    Authorization: token
  }
})
