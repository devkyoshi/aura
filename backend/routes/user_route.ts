import express from 'express';
import { updateUser, removeUser } from '@controllers/user_controller';

const router = express.Router();

router.post('/update/:{id}', updateUser);
router.post('/delete/:{id}', removeUser);

export default router;
