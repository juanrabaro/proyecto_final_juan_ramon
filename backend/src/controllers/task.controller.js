import Task from '../models/task.model.js'

async function validateId(req, res) {
  if (req.params.id.length !== 24) {
    throw new Error('Invalid id');
  }

  const doesExist = await Task.exists({ _id: req.params.id });

  if (!doesExist) {
    throw new Error('Task not found');
  }
}

export const getTasks = async (req, res) => {

  const tasks = await Task.find({
    user: req.user.id
  }).populate('user', '_id');

  res.json(tasks);
}

export const getTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const tasks = await Task.findById(req.params.id);

  if (!tasks) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(tasks);
}

export const addTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  const newTask = new Task({ title, description, user: req.user.id });
  const savedTask = await newTask.save();

  res.json(savedTask);
}

export const updateTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true });

  if (!updatedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(updatedTask);
}

export const deleteTask = async (req, res) => {
  try {
    await validateId(req, res)
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  
  const deletedTask = await Task.findByIdAndDelete(req.params.id);

  if (!deletedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(deletedTask);
}