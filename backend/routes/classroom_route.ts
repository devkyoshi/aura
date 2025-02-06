import {
  createClassroom,
  getAllClassrooms,
  getClassroomsByInstructor,
} from '@controllers/classroom_controller';
import express, { Router } from 'express';
import { checkPermission } from '../middlewares/userPermission_middleware';
import { permissions } from '@config/user_permissions';

const router: Router = express.Router();

router.post(
  '/create',
  checkPermission(permissions.create_classroom) as express.RequestHandler,
  createClassroom
);

router.get('/all', getAllClassrooms);

router.get(
  '/instructor/get',
  checkPermission(permissions.get_classrooms) as express.RequestHandler,
  getClassroomsByInstructor
);

export default router;
