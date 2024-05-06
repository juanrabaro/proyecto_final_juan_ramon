import CronoTask from '../models/cronoTask.model.js'

async function validateId(req, res) {
  if (req.params.id.length !== 24) {
    throw new Error('Invalid id');
  }

  const doesExist = await CronoTask.exists({ _id: req.params.id });

  if (!doesExist) {
    throw new Error('Task not found');
  }
}

export const getCronoTasks = async (req, res) => {

  const tasks = await CronoTask.find({
    user: req.user.id
  }).populate('user', '_id');

  res.json(tasks);
}

export const getCronoTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
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

async function updateTitle(req, res) {
  const updatedTask = await CronoTask.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true });

  if (!updatedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(updatedTask);
}
const horaActual = () => {
  return new Date();
}
async function startCrono(req, res) {
  const oldTask = await CronoTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  // If the task has started for the first time
  if (!oldTask.timeStarted) {
    const updatedTask = await CronoTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "running",
        timeStarted: horaActual(),
      },
      { new: true });

    res.json(updatedTask);
  }
  // If the task has been paused before
  else {
    const updatedTask = await CronoTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "running",
        stoppedMoment: null,
        showedCronoForPause: "00:00:00:0",
        stoppedTime: oldTask.stoppedTime + ((horaActual() - oldTask.stoppedMoment) / 100),
      },
      { new: true });

    res.json(updatedTask);
  }
}
async function pauseCrono(req, res) {
  const oldTask = await CronoTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  const updatedTask = await CronoTask.findByIdAndUpdate(
    req.params.id,
    {
      running: "paused",
      stoppedMoment: horaActual(),
      showedCronoForPause: req.body.showedCronoForPause,
    },
    { new: true });

  res.json(updatedTask);
}
async function stopCrono(req, res) {
  const oldTask = await CronoTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  if (oldTask.running === "paused") {
    const updatedTask = await CronoTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "stopped",
        timeStarted: null,
        stoppedMoment: null,
        stoppedTime: 0,
        showedCronoForPause: "00:00:00:0",
        totalTime: (oldTask.totalTime + ((horaActual() - oldTask.timeStarted) - (oldTask.stoppedTime + (horaActual() - oldTask.stoppedMoment))) / 100),
      },
      { new: true });

    res.json(updatedTask);
  } else if (oldTask.running === "running") {
    const updatedTask = await CronoTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "stopped",
        timeStarted: null,
        stoppedMoment: null,
        stoppedTime: 0,
        showedCronoForPause: "00:00:00:0",
        totalTime: (oldTask.totalTime + (((horaActual() - oldTask.timeStarted) / 100) - oldTask.stoppedTime)),
      },
      { new: true });

    console.log("tiempo total: " + ((horaActual() - oldTask.timeStarted) / 100));
    console.log("tiempo parado: " + oldTask.stoppedTime);
    console.log("total final: " + updatedTask.totalTime);

    res.json(updatedTask);
  }
}
export const updateCronoTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // If the title is being updated, only update the title
  if (req.body.title) {
    updateTitle(req, res);
  }
  // Start, pause or stop the crono
  else {
    if (req.body.running === "run") {
      startCrono(req, res);
    } else if (req.body.running === "pause") {
      pauseCrono(req, res);
    } else if (req.body.running === "stop") {
      stopCrono(req, res);
    } else {
      res.status(400).json({ message: 'Invalid action, use run, pause or stop' });
    }
  }
}

export const deleteCronoTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const deletedTask = await CronoTask.findByIdAndDelete(req.params.id);

  if (!deletedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(deletedTask);
}