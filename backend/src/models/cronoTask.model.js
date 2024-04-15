import mongoose from 'mongoose'

const cronoTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  running: {
    type: Boolean,
    default: false,
  },
  timeStarted: {
    type: Date,
    default: null,
  },
  totalTime: {
    type: Number,
    default: 0,
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