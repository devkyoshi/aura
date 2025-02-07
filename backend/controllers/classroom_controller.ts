import { CustomRequest } from '@datatypes/response_tp';
import logger from '@config/logger';
import {
  error_messages,
  HTTP_STATUS,
  success_messages,
} from '@config/constants';
import { IClassroomRequest, IClassroomResponse } from '@datatypes/classroom_tp';

import User from '@models/user_model';
import { CLASS_CATEGORIES, USER_ROLE } from '@config/app_constants';
import Classroom from '@models/classroom_model';

export const createClassroom = async (
  req: CustomRequest<IClassroomRequest>,
  res: any
) => {
  logger.info('Attempting to create a classroom by user: ', req.user?.id);
  try {
    if (!req.user) {
      logger.error(`User not provided when creating classroom`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.user_not_provided,
        success: false,
      });
    }

    if (
      !req.body.title &&
      !req.body.instructor &&
      !req.body.grade &&
      !req.body.category
    ) {
      logger.error(`Missing required fields in creating classroom`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.missing_fields,
        success: false,
      });
    }

    //validate category
    if (!CLASS_CATEGORIES.includes(req.body.category)) {
      logger.error(`Invalid category: ${req.body.category}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.invalid_inputs,
        success: false,
      });
    }

    //validate instructor
    const instructor = await User.findById(req.body.instructor);
    if (!instructor) {
      logger.error(`Instructor not found: ${req.body.instructor}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.user_not_found,
        success: false,
      });
    }

    if (
      instructor.role !== USER_ROLE.INSTRUCTOR &&
      instructor.role !== USER_ROLE.ADMIN
    ) {
      logger.error(
        `User is not an instructor: ${instructor.username}: ${instructor.role}`
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.permission_denied,
        success: false,
      });
    }

    //create classroom
    const classroomData: any = {
      title: req.body.title,
      instructor: instructor._id,
      grade: req.body.grade,
      category: req.body.category,
    };

    if (req.body.description) classroomData.description = req.body.description;
    if (req.body.price) classroomData.price = req.body.price;
    if (req.body.lesson) classroomData.lesson = req.body.lesson;
    if (req.body.students_enrolled)
      classroomData.students_enrolled = req.body.students_enrolled;
    if (req.body.passcode) classroomData.passcode = req.body.passcode;
    if (req.body.tags) classroomData.tags = req.body.tags;
    if (req.body.start_time) classroomData.start_time = req.body.start_time;
    if (req.body.end_time) classroomData.end_time = req.body.end_time;
    if (req.body.thumbnail) classroomData.thumbnail = req.body.thumbnail;
    if (req.body.published) classroomData.published = req.body.published;
    if (req.body.is_private) classroomData.is_private = req.body.is_private;

    const classroom = new Classroom(classroomData);

    const added_classroom = await classroom.save();
    logger.info(`Classroom created successfully: ${classroom._id}`);

    return res.status(HTTP_STATUS.CREATED).json({
      data: added_classroom,
      message: success_messages.classroom_created_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Create classroom attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const getAllClassrooms = async (_req: CustomRequest, res: any) => {
  logger.info('Attempting to fetch classrooms');
  try {
    const classrooms = await Classroom.find().populate('instructor');
    logger.info(`Classrooms fetched successfully`);

    return res.status(HTTP_STATUS.OK).json({
      data: classrooms,
      message: success_messages.classroom_fetch_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Fetch classrooms attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};

export const getClassroomsByInstructor = async (
  req: CustomRequest,
  res: any
) => {
  try {
    if (!req.user) {
      logger.error(`User not provided when creating classroom`);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        data: null,
        message: error_messages.user_not_provided,
        success: false,
      });
    }

    logger.info(
      `Attempting to get all classrooms for the instructor: ${req.user.id}`
    );

    const classrooms = await Classroom.find({ instructor: req.user.id });

    const response: IClassroomResponse[] = classrooms.map((classroom) => ({
      classroom_id: classroom._id?.toString(),
      title: classroom.title,
      description: classroom.description as string,
      price: classroom.price as number,
      instructor: classroom.instructor?._id?.toString() as string,
      grade: classroom.grade as string,
      lesson: classroom.lesson?.map((lesson) => lesson?._id?.toString()) || [],
      students_enrolled:
        classroom.students_enrolled.map((student) => student.toString()) || [],
      category: classroom.category as string,
      tags: classroom.tags || [],
      start_time: classroom.start_time?.toISOString(),
      end_time: classroom.end_time?.toISOString(),
      thumbnail: classroom.thumbnail as string,
      published: classroom.published || false,
      is_active: classroom.is_active || false,
      created_at: classroom.createdAt,
      updated_at: classroom.updatedAt,
    }));

    logger.info(
      `Classrooms fetched successfully for the instructor: ${req.user.id}`
    );

    return res.status(HTTP_STATUS.OK).json({
      data: response,
      message: success_messages.classroom_fetch_success,
      success: true,
    });
  } catch (error) {
    logger.error(`Fetch classrooms attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};
