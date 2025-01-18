import { Request, Response, NextFunction } from 'express';
import { error_messages, HTTP_STATUS } from '@config/constants';
import { rolePermissions } from '@config/user_permissions';
import logger from '@config/logger';

interface CustomRequest extends Request {
  user?: { role?: string };
}

export const checkPermission = (required_permission: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // If no user or role is defined in the request, deny access

    if (!req.user?.role) {
      logger.error('Request denied: Role not defined in the request');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: error_messages.role_not_defined,
        data: null,
      });
    }

    const userRole = req.user.role;

    // Check if the role exists in the rolePermissions map
    if (!rolePermissions[userRole]) {
      logger.error(`Request denied: Invalid role: ${userRole}`);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: error_messages.invalid_role,
        data: null,
      });
    }

    // Check if the user has the required permission
    if (!rolePermissions[userRole].includes(required_permission)) {
      logger.error(
        `Request denied: User with role: ${userRole} does not have permission: ${required_permission}`
      );
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        data: null,
        message: error_messages.permission_denied,
      });
    }

    // If the user has the permission, continue to the next middleware or route handler
    next();
  };
};
