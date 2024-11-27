import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }
});

export const Student = mongoose.model('Student', studentSchema);