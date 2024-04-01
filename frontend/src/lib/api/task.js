import { myAxios } from "./myAxios.js"

export const getTasks = (token) => myAxios.get('/tasks', {
  headers: {
    Authorization: token
  }
})

export const getTask = (id) => myAxios.get(`/task/${id}`)

export const addTask = (task) => myAxios.post('/add-task', task)

export const updateTask = (task) => myAxios.put(`/update-task/${task._id}`, task)

export const deleteTask = (id) => myAxios.put(`/delete-task/${id}`)
