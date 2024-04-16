import TimerTask from '../models/timerTask.model.js'

async function validateId(req, res) {
  if (req.params.id.length !== 24) {
    throw new Error('Invalid id');
  }

  const doesExist = await TimerTask.exists({ _id: req.params.id });

  if (!doesExist) {
    throw new Error('Task not found');
  }
}

export const getTimerTasks = async (req, res) => {

  const tasks = await TimerTask.find({
    user: req.user.id
  }).populate('user', '_id');

  res.json(tasks);
}

export const getTimerTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const tasks = await TimerTask.findById(req.params.id);

  if (!tasks) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(tasks);
}

export const addTimerTask = async (req, res) => {
  const { title, maxTime } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = new TimerTask({ title, maxTime, user: req.user.id });
  const savedTask = await newTask.save();

  res.json(savedTask);
}

async function updateTitle(req, res) {
  const updatedTask = await TimerTask.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true });

  if (!updatedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(updatedTask);
}
const horaActual = () => {
  return Date.now() / 1000;
}
async function startTimer(req, res) {
  const oldTask = await TimerTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  // If the task has started for the first time
  if (!oldTask.timeStarted) {
    const updatedTask = await TimerTask.findByIdAndUpdate(
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
    const updatedTask = await TimerTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "running",
        stoppedMoment: null,
        stoppedTime: oldTask.stoppedTime + (horaActual() - oldTask.stoppedMoment),
      },
      { new: true });

    res.json(updatedTask);
  }
}
async function pauseTimer(req, res) {
  const oldTask = await TimerTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  const updatedTask = await TimerTask.findByIdAndUpdate(
    req.params.id,
    {
      running: "paused",
      stoppedMoment: horaActual(),
      remainingTime: oldTask.maxTime - ((horaActual() - oldTask.timeStarted) - oldTask.stoppedTime),
    },
    { new: true });

  res.json(updatedTask);
}
async function stopTimer(req, res) {
  const oldTask = await TimerTask.findById(req.params.id);
  if (!oldTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  if (oldTask.running === "running") {
    const updatedTask = await TimerTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "stopped",
        timeStarted: null,
        stoppedMoment: null,
        stoppedTime: 0,
        maxTime: oldTask.maxTime,
        remainingTime: oldTask.maxTime,
        totalTime: oldTask.totalTime + ((horaActual() - oldTask.timeStarted) - oldTask.stoppedTime),
      },
      { new: true });
  
    res.json(updatedTask);
  } else {
    const updatedTask = await TimerTask.findByIdAndUpdate(
      req.params.id,
      {
        running: "stopped",
        timeStarted: null,
        stoppedMoment: null,
        stoppedTime: 0,
        maxTime: oldTask.maxTime,
        remainingTime: oldTask.maxTime,
        totalTime: oldTask.totalTime + ((horaActual() - oldTask.timeStarted) - (oldTask.stoppedTime + (horaActual() - oldTask.stoppedMoment))),
      },
      { new: true });
  
    res.json(updatedTask);
  }
}
export const updateTimerTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // If the title is being updated, only update the title
  if (req.body.title) {
    updateTitle(req, res);
  }
  // Start, pause or stop the Timer
  else {
    if (req.body.running === "run") {
      startTimer(req, res);
    } else if (req.body.running === "pause") {
      pauseTimer(req, res);
    } else if (req.body.running === "stop") {
      stopTimer(req, res);
    } else {
      res.status(400).json({ message: 'Invalid action, use run, pause or stop' });
    }
  }
}

export const deleteTimerTask = async (req, res) => {

  try {
    await validateId(req, res)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const deletedTask = await TimerTask.findByIdAndDelete(req.params.id);

  if (!deletedTask) {
    return res.status(400).json({ message: 'Task not found' })
  }

  res.json(deletedTask);
}