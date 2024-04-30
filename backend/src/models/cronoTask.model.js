import mongoose from 'mongoose'

const cronoTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  running: {
    type: String,
    enum: ['stopped', 'running', 'paused'],
    default: 'stopped',
  },
  timeStarted: {
    type: Date,
    default: null,
  },
  stoppedMoment: {
    type: Date,
    default: null,
  },
  stoppedTime: {
    type: Number,
    default: 0,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
  actualTimeForPause: {
    type: String,
    default: "00:00:00",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
  { timestamps: true }
)

export default mongoose.model('CronoTask', cronoTaskSchema)