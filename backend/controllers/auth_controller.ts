import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/user_model';
import {ILogin, IUser} from '@datatypes/user_tp';
import { error_messages, success_messages } from '@config/constants';
import {Request} from "express";
import logger from "@config/logger";

export const registerUser = async (req:Request<IUser>,res:any) => {
    try {
        const user_data = req.body;
        logger.info(`Attempting to register user: ${user_data.username}`);

        if (!user_data.first_name || !user_data.last_name || !user_data.email || !user_data.password || !user_data.username) {
            logger.error('Missing fields in user registration request');
            return res.status(400).json({
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
            return res.status(400).json({
                data: null,
                message: error_messages.user_already_exists,
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

        const token = jwt.sign(
            { id: new_user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        logger.info(`User registered successfully with username: ${user_data.username}`);
        return res.status(201).json({
            data: { token },
            message: success_messages.user_registered_successfully,
            success: true,
        });
    } catch (e) {
        logger.error('Error registering user: ', e);
        return res.status(500).json({
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
            return res.status(400).json({
                data: null,
                message: error_messages.missing_fields,
                success: false,
            });
        }

        const user = await User.findOne({ username: login_request.username });
        if (!user) {
            logger.error('Attempt failed to log in user: user not found');
            return res.status(400).json({
                data: null,
                message: error_messages.user_not_found,
                success: false,
            });
        }

        const is_password_valid = await bcrypt.compare(login_request.password, user.password);
        if (!is_password_valid) {
            logger.error('Attempt failed to log in user: invalid credentials');
            return res.status(400).json({
                data: null,
                message: error_messages.invalid_credentials,
                success: false,
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        logger.info(`User logged in successfully with username: ${login_request.username}`);
        return res.status(200).json({
            data: {
                token,
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
        console.error('Error logging in user: ', e);
        return res.status(500).json({
            data: null,
            message: error_messages.server_error,
            success: false,
        });
    }
};
