import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@models/user_model';
import { ILogin, IUser } from '@datatypes/user_tp';
import {
  error_messages,
  HTTP_STATUS,
  success_messages,
} from '@config/constants';
import { Request } from 'express';
import logger from '@config/logger';
import { USER_ROLE } from '@config/app_constants';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../middlewares/jwtAuth_middleware';

export const registerUser = async (req: Request<IUser>, res: any) => {
  try {
    const user_data = req.body;
    logger.info(`Attempting to register user: ${user_data.username}`);

    if (
      !user_data.first_name ||
      !user_data.last_name ||
      !user_data.email ||
      !user_data.password ||
      !user_data.username
    ) {
      logger.error('Missing fields in user registration request');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.missing_fields,
        success: false,
      });
    }

    const existing_user = await User.findOne({
      $or: [{ email: user_data.email }, { username: user_data.username }],
    });

    if (existing_user) {
      logger.error('Attempt failed to register user: user already exists');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.user_already_exists,
        success: false,
      });
    }

    //check if role is valid if provided
    if (req.body.role && !Object.values(USER_ROLE).includes(req.body.role)) {
      logger.error('Update attempt failed: Invalid role');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_role,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(user_data.password, salt);

    const new_user = new User({
      ...user_data,
      location: {
        address: user_data.address,
        city: user_data.city,
        postal_code: user_data.postal_code,
        country: user_data.country,
      },
      password: hashed_password,
    });

    await new_user.save();

    const access_token = generateAccessToken(
      new_user._id.toString(),
      new_user.role
    );
    const refresh_token = generateRefreshToken(
      new_user._id.toString(),
      new_user.role
    );

    new_user.refresh_token = refresh_token;
    await new_user.save();

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    logger.info(
      `User registered successfully with username: ${user_data.username}`
    );
    return res.status(HTTP_STATUS.CREATED).json({
      data: { access_token },
      message: success_messages.user_registered_successfully,
      success: true,
    });
  } catch (e) {
    logger.error('Error registering user: ', e);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const loginUser = async (req: Request<ILogin>, res: any) => {
  try {
    const login_request = req.body;
    logger.info(`Attempting to log in user: ${login_request.username}`);

    if (!login_request.username || !login_request.password) {
      logger.error('Missing fields in user login request');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.missing_fields,
        success: false,
      });
    }

    const user = await User.findOne({ username: login_request.username });
    if (!user) {
      logger.error('Attempt failed to log in user: user not found');
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    const is_password_valid = await bcrypt.compare(
      login_request.password,
      user.password
    );
    if (!is_password_valid) {
      logger.error('Attempt failed to log in user: invalid credentials');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_credentials,
        success: false,
      });
    }

    const access_token = generateAccessToken(user._id.toString(), user.role);
    const refresh_token = generateRefreshToken(user._id.toString(), user.role);

    user.refresh_token = refresh_token;
    await user.save();

    logger.info(
      `User logged in successfully with username: ${login_request.username}`
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return res.status(HTTP_STATUS.OK).json({
      data: {
        access_token,
        user: {
          user_id: user._id.toString(),
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      message: success_messages.user_login_success,
      success: true,
    });
  } catch (e) {
    logger.error('User logging attempt failed with error:  ', e);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const refreshToken = async (req: Request, res: any) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      logger.error('Refresh token not provided');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        data: null,
        message: error_messages.unauthorized,
        success: false,
      });
    }

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user || user.refresh_token !== refresh_token) {
      logger.error('Invalid refresh token');
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        data: null,
        message: error_messages.unauthorized,
        success: false,
      });
    }

    const access_token = generateAccessToken(user._id.toString(), user.role);
    const new_refresh_token = generateRefreshToken(
      user._id.toString(),
      user.role
    );
    user.refresh_token = new_refresh_token;
    await user.save();

    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return res.status(HTTP_STATUS.OK).json({
      data: { access_token },
      message: success_messages.token_refreshed,
      success: true,
    });
  } catch (e) {
    logger.error('Token refresh attempt failed with error: ', e);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};
