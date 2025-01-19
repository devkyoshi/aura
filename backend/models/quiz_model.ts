import mongoose from 'mongoose';

/*
 * Quiz Schema
 * This schema is used to store quiz details which used for online quiz's
 */
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    time_in_min: { type: Number, required: true },
    total_marks: { type: Number, required: true },
    questions: [
      {
        question: { type: String, required: true },
        marks: { type: Number, required: true },
        options: [
          {
            option: { type: String, required: true },
            is_correct: { type: Boolean, required: true },
          },
        ],
      },
    ],
    published: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Quiz = mongoose.model('quiz', quizSchema);

export default Quiz;
