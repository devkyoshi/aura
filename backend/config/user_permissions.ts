// define the permissions for the users here
export const permissions = {
  view_user_profile: 'view_user_profile',
};

export const rolePermissions: { [key: string]: string[] } = {
  admin: [permissions.view_user_profile],
  teacher: [],
  student: [],
};
