import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { error_messages, HTTP_STATUS } from '@config/constants';
import logger from '@config/logger';

interface CustomRequest extends Request {
  user?: { id: string; role: string } | string;
}

export const validateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.error('Token not received with the request.');
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: error_messages.unauthorized,
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = {
      id: decoded.user.id as string,
      role: decoded.user.role as string,
    };

    next();
  } catch (error) {
    logger.error('Invalid or expired token');
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: error_messages.invalid_token,
      data: null,
    });
  }
};

export const generateAccessToken = (user_id: string, role: string) => {
  return jwt.sign(
    { user: { id: user_id, role } },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
};

export const generateRefreshToken = (user_id: string, role: string) => {
  return jwt.sign(
    { user: { id: user_id, role } },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    }
  );
};
