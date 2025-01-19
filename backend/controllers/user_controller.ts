import { IUpdateUser, IUser, IUserDTO } from '@datatypes/user_tp';
import { Request } from 'express';
import logger from '@config/logger';
import User from '@models/user_model';

import mongoose from 'mongoose';
import {
  error_messages,
  HTTP_STATUS,
  success_messages,
} from '@config/constants';
import bcrypt from 'bcryptjs';

mongoose.set('debug', true);

interface CustomRequest extends Request {
  user?: { id?: string };
}

//common routes
export const getAccount = async (req: Request, res: any) => {
  const userId = req.params.user_id;
  logger.info(`Attempting to get user with ID: ${userId}`);
  try {
    if (!userId) {
      logger.error('Get attempt failed: Invalid inputs: Missing user_id');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      logger.error(
        `Get user attempt failed: User not found with the user_id: ${userId}`
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    const user_dto: IUserDTO = {
      user_id: user._id as unknown as string,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    return res.status(HTTP_STATUS.OK).json({
      data: user_dto,
      message: success_messages.user_fetch_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Get user attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const removeAccount = async (req: CustomRequest, res: any) => {
  const userID = req.user?.id;
  logger.info(`User ${userID} is attempting to delete their account`);
  try {
    if (!userID) {
      logger.error(
        'Account remove attempt failed: Invalid inputs: Missing user_id'
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    const result = await User.deleteOne({ _id: userID });
    if (result.deletedCount === 0) {
      logger.error(
        `Account remove attempt failed: User not found with the user_id: ${userID}`
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
    logger.error(`Account remove attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

//protected routes
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
      'role',
    ];

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      current_user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update top-level fields
    for (const key of Object.keys(req.body) as (keyof IUpdateUser)[]) {
      if (allowed_updates.includes(key) && req.body[key] !== undefined) {
        (current_user as any)[key] = req.body[key];
      }
    }

    // Handle nested 'location' updates
    if (req.body.location) {
      const locationUpdates = req.body.location;

      if (typeof locationUpdates === 'object') {
        for (const key of Object.keys(locationUpdates)) {
          if (
            ['address', 'city', 'postal_code', 'country'].includes(key) &&
            locationUpdates[key] !== undefined
          ) {
            (current_user.location as any)[key] = locationUpdates[key];
          }
        }
      }
    }

    // Save updated user
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

export const getUser = async (req: CustomRequest, res: any) => {
  const userID = req.user?.id;
  logger.info(`Attempting to get user: ${userID}`);
  try {
    if (!userID) {
      logger.error('Get attempt failed: Invalid inputs: Missing user_id');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    const user = await User.findOne({ _id: userID });
    if (!user) {
      logger.error(
        `Get user attempt failed: User not found with the user_id: ${userID}`
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    const user_dto: IUserDTO = {
      user_id: user._id as unknown as string,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    return res.status(HTTP_STATUS.OK).json({
      data: user_dto,
      message: success_messages.user_fetch_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Get user attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const getAllUsers = async (req: Request, res: any) => {
  logger.info('Attempting to get all users');
  try {
    const users = await User.find();

    if (users.length === 0) {
      logger.error('Get all users attempt failed: No users found');
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: [],
        message: error_messages.no_users_found,
        success: true,
      });
    }

    const users_dto: IUserDTO[] = users.map((user) => {
      return {
        user_id: user._id as unknown as string,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      };
    });

    return res.status(HTTP_STATUS.OK).json({
      data: users_dto,
      message: success_messages.user_fetch_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Get all users attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};
