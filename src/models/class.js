import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: {
    type: Date,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
});

export const Class = mongoose.model('Class', classSchema);