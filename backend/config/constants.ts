export const error_messages = {
  user_already_exists: 'User already exists',
  user_not_found: 'User not found',
  invalid_credentials: 'Invalid credentials. Please try again',
  user_update_error: 'Error updating user. Please try again',
  user_delete_error: 'Error deleting user. Please try again',
  invalid_inputs: 'Invalid inputs. Please check and try again',
  missing_fields: 'Missing fields. Please check and try again',
  server_error: 'Server Error. Please contact support or try again later',
};

export const success_messages = {
  user_registered_successfully: 'User registered successfully',
  user_login_success: 'User logged in successfully',
  user_updated_success: 'User updated successfully',
  user_deleted_success: 'User deleted successfully',

  server_connected: 'MongoDB connected successfully',
  server_running: 'Aura backend server is running!',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
