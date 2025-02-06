import { signupFormSchema } from '@/components/auth/signup-form';
import apiClient from '@/lib/axios.config';

import toast from 'react-hot-toast';
import { z } from 'zod';

export const registerUser = async (signUpData: z.infer<typeof signupFormSchema>) => {

   const response = await apiClient.post('/auth/register', signUpData);
   if(response.data.success) {
     toast('Registration successful. Please login to continue.');
     return true;
   }else{
     toast.error(response.data.message || 'An error occurred while registering. Please try again.');
     return false;
   }
}

