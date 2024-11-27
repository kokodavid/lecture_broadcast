import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }]
});

export const Lecturer = mongoose.model('Lecturer', lecturerSchema);