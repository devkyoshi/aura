import { CustomRequest } from '@datatypes/response_tp';
import logger from '@config/logger';
import { error_messages, HTTP_STATUS } from '@config/constants';
import { IClassroomRequest } from '@datatypes/classroom_tp';

//TODO: Complete the classroom controller
export const createClassroom = async (
  req: CustomRequest<IClassroomRequest>,
  res: any
) => {
  logger.info('Attempting to create a classroom by user: ', req.user?.id);

  try {
  } catch (error) {
    logger.error(`Create classroom attempt failed: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: error_messages.server_error,
      success: false,
    });
  }
};
