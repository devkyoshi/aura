import express from 'express';
import {
  updateUser,
  removeUser,
  getUser,
  removeAccount,
  getAccount,
  getAllUsers,
} from '@controllers/user_controller';
import { checkPermission } from '../middlewares/userPermission_middleware';
import { permissions } from '@config/user_permissions';

const router = express.Router();

router.post(
  '/update/:user_id',
  checkPermission(permissions.update_user) as express.RequestHandler,
  updateUser
);
router.post(
  '/remove/:user_id',
  checkPermission(permissions.delete_user) as express.RequestHandler,
  removeUser
);

router.get(
  '/get/profile/:user_id',
  checkPermission(permissions.view_user_profile) as express.RequestHandler,
  getUser
);
router.get(
  '/get/all-users',
  checkPermission(permissions.get_all_users) as express.RequestHandler,
  getAllUsers
);

// common routes
router.get('/me/remove', removeAccount);
router.get('/me', getAccount);

export default router;
