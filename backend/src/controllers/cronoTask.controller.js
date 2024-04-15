import CronoTask from '../models/cronoTask.model.js'

export const getCronoTasks = async (req, res) => {

  const tasks = await CronoTask.find({
    user: req.user.id
  }).populate('user', '_id');

  res.json(tasks);
}

export const getCronoTask = async (req, res) => {

  if (req.params.id.length !== 24) {
    return res.status(400).json({ message: 'Invalid id' })
  }

  const doesExist = await CronoTask.exists({ _id: req.params.id });

  if (!doesExist) {
    return res.status(400).json({ message: 'Task not found' })
  }

  const tasks = await CronoTask.findById(req.params.id);

  if (!tasks) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(tasks);
}

export const addCronoTask = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = new CronoTask({ title, user: req.user.id });
  const savedTask = await newTask.save();

  res.json(savedTask);
}

export const updateCronoTask = async (req, res) => {
  if (req.body.title) {
    const updatedTask = await CronoTask.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true });

    if (!updatedTask) {
      return res.status(400).json({ message: 'Task not found' })
    }
    
    res.json(updatedTask);

  } else {
    return res.status(200).json({ message: 'Not updating the title' })
  }
  /* const { title, description } = req.body;

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

  res.json(updatedTask); */
}

export const deleteCronoTask = async (req, res) => {

  const deletedTask = await CronoTask.findByIdAndDelete(req.params.id);

  if (!deletedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(deletedTask);
}