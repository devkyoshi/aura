export interface IUser {
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email: string;
  password: string;
  username: string;
  role?: 'teacher' | 'student' | 'admin';
}

export interface IUserDTO {
  user_id: string;
  first_name: string;
  last_name: string;
  location:
    | {
        address?: string | null;
        city?: string | null;
        postal_code?: string | null;
        country?: string | null;
      }
    | null
    | undefined;
  phone?: string | null;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  role?: 'teacher' | 'student' | 'admin';
}

export interface IUpdateUser {
  user_id: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email: string;
  password: string;
  username: string;
  role?: 'teacher' | 'student' | 'admin';
}

export interface ILogin {
  username: string;
  password: string;
}

// export interface IUserResponse {
//     token: string;
//     user : {
//         user_id: string;
//         first_name: string;
//         last_name:string;
//         email:string;
//         username:string;
//         role: string
//     }
// }
