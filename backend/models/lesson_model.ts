import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },

    /**
     * videos: [{ type: String, validate: { validator: (v) => isURL(v), message: 'Invalid video URL' } }],
     * notes: [{ type: String, validate: { validator: (v) => isURL(v), message: 'Invalid note URL' } }],
     */
    videos: [{ type: String }],
    notes: [{ type: String }],
    papers: [
      {
        paper: { type: String },
        published: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz',
      },
    ],
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'classroom',
      required: true,
    },

    estimated_time_in_min: { type: Number, required: false }, //in minutes
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
      },
    ],

    //add likes, students_engaged properties later

    published: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('lesson', lessonSchema);

export default Lesson;
