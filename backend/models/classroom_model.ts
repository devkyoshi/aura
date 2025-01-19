import mongoose from 'mongoose';
import { CLASS_CATEGORY } from '@config/app_constants';

const classroomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    grade: { type: String, required: true },
    lesson: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
      },
    ],
    students_enrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    passcode: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        CLASS_CATEGORY.A_LEVEL,
        CLASS_CATEGORY.O_LEVEL,
        CLASS_CATEGORY.PRIMARY,
      ],
    },
    tags: [{ type: String }],
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    thumbnail: { type: String, required: true },
    published: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_private: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Classroom = mongoose.model('classroom', classroomSchema);

export default Classroom;
