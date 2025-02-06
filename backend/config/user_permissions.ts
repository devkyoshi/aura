// define the permissions for the users here
export const permissions = {
  admin_permission: 'admin_permission',
  view_user_profile: 'view_user_profile',
  delete_user: 'delete_user',
  update_user: 'update_user',
  get_all_users: 'get_all_users',
  create_classroom: 'create_classroom',
  get_classrooms: 'get_classrooms',
};

export const rolePermissions: { [key: string]: string[] } = {
  admin: [permissions.admin_permission],
  instructor: [
    permissions.view_user_profile,
    permissions.update_user,
    permissions.create_classroom,
    permissions.get_classrooms,
  ],
  student: [permissions.update_user],
};
