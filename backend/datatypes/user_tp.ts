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
  role?: 'customer' | 'seller' | 'admin';
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
  role?: 'customer' | 'seller' | 'admin';
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
