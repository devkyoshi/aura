import express from 'express';
import { updateUser, removeUser, getUser } from '@controllers/user_controller';
import { checkPermission } from '../middlewares/userPermission_middleware';
import { permissions } from '@config/user_permissions';

const router = express.Router();

router.post('/update/:user_id', updateUser);
router.post('/remove/:user_id', removeUser);
router.get(
  '/me/:user_id',
  checkPermission(permissions.view_user_profile) as express.RequestHandler,
  getUser
);

export default router;
