import apiClient from '@/lib/axios.config';
import toast from 'react-hot-toast';

export const fetchClassroomsByInstructor = async () => {
  const response = await apiClient.get('/classroom/instructor/get'
  );

  const is_success = response.data.success as boolean;
  if(is_success) {
   return { success: true, data: response.data.data };
  }else{
    toast.error(response.data.message || 'An error occurred while fetching classrooms. Please try again.');
    return { success: false, data: [] };
  }

}