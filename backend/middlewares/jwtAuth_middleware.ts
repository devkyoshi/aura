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
      id: decoded.id as string,
      role: decoded.role as string,
    };

    logger.info(
      `User with id: ${req.user.id} and role: ${req.user.role} is authorized`
    );
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: error_messages.invalid_token,
      data: null,
    });
  }
};
