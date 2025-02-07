import express, { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from '@controllers/auth_controller';
import { validateJWT } from '../middlewares/jwtAuth_middleware';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh-token', refreshToken);
router.get('/logout', validateJWT as express.RequestHandler, logoutUser);

export default router;
