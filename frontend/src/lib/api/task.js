import myAxios from "./myAxios.js"

export const getTasks = (token) => myAxios.get('/tasks', {
  headers: {
    Authorization: token
  }
})

export const getTaskById = (id, token) => myAxios.get(`/task/${id}`, {
  headers: {
    Authorization: token
  }
})

export const addTask = (task, token) => myAxios.post('/add-task', task, {
  headers: {
    Authorization: token
  }
})

export const updateTask = (task, token) => myAxios.put(`/update-task/${task._id}`, task, {
  headers: {
    Authorization: token
  }
})

export const deleteTask = (id, token) => myAxios.delete(`/delete-task/${id}`, {
  headers: {
    Authorization: token
  }
})
