import express from 'express';
import { updateUser, removeUser } from '@controllers/user_controller';

const router = express.Router();

router.post('/update/:user_id', updateUser);
router.post('/delete/:user_id', removeUser);

export default router;
