import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: {
      address: { type: String, required: false },
      city: { type: String, required: false },
      postal_code: { type: String, required: false },
      country: { type: String, required: false },
    },
    phone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: {
      type: String,
      default: 'student',
      enum: ['teacher', 'student', 'admin'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);
export default User;
