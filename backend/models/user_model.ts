import mongoose from 'mongoose';
import { USER_ROLE } from '@config/app_constants';

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
      default: USER_ROLE.STUDENT,
      enum: [USER_ROLE.INSTRUCTOR, USER_ROLE.STUDENT, USER_ROLE.ADMIN],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);
export default User;
