import { IUpdateUser, IUser } from '@datatypes/user_tp';
import { Request } from 'express';
import logger from '@config/logger';
import User from '@models/user_model';
import {
  error_messages,
  HTTP_STATUS,
  success_messages,
} from '@config/constants';

export const updateUser = async (req: Request<IUpdateUser>, res: any) => {
  const userID = req.params.user_id;
  logger.info(`Attempting to update user: ${userID}`);
  try {
    if (!userID) {
      logger.error('Update attempt failed: Invalid inputs: Missing user_id');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    const current_user = await User.findOne({ _id: userID });

    if (!current_user) {
      logger.error(
        `Update attempt failed: User not found with the user_id: ${userID}`
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    const allowed_updates = [
      'first_name',
      'last_name',
      'username',
      'email',
      'phone',
      'password',
      'address',
      'city',
      'role',
      'postal_code',
      'country',
    ];

    for (const key of Object.keys(req.body) as (keyof IUpdateUser)[]) {
      if (allowed_updates.includes(key) && req.body[key] !== undefined) {
        (current_user as any)[key] = req.body[key];
      }
    }
    await current_user.save();
    logger.info(`User updated successfully: ${userID}`);

    return res.status(HTTP_STATUS.OK).json({
      data: current_user,
      message: success_messages.user_updated_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Update attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const removeUser = async (req: Request, res: any) => {
  const userID = req.params.user_id;
  logger.info(`Attempting to delete user: ${userID}`);
  try {
    if (!userID) {
      logger.error('Delete attempt failed: Invalid inputs: Missing user_id');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    const result = await User.deleteOne({ _id: userID });
    if (result.deletedCount === 0) {
      logger.error(
        `Delete attempt failed: User not found with the user_id: ${userID}`
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    logger.info(`User deleted successfully: ${userID}`);
    return res.status(HTTP_STATUS.OK).json({
      data: null,
      message: success_messages.user_deleted_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Delete attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};
