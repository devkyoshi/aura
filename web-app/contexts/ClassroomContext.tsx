'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { IClassroomResponse } from '@/types/classroom.type';
import { fetchClassroomsByInstructor } from '@/services/classroom.service';


interface ClassroomContextProps {
  classrooms: IClassroomResponse[] ;
  loading: boolean;
  fetchClassrooms: () => Promise<void>;
}

const ClassroomContext = createContext<ClassroomContextProps | undefined>(undefined);

export const ClassroomProvider = ({ children }: { children: ReactNode }) => {
  const [classrooms, setClassrooms] = useState<IClassroomResponse[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClassrooms = async () => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      const response  = await fetchClassroomsByInstructor();
      if (response.success) {
        setClassrooms(response.data);
      }
    }

    setLoading(false);
  }

  // Load classrooms from the server on initial render
  useEffect(() => {
    fetchClassrooms()
  }, []);

  return (
    <ClassroomContext.Provider
      value={{ classrooms, loading, fetchClassrooms }}
>
  {children}
  </ClassroomContext.Provider>
);
};

// Hook to use AuthContext
export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within an ClassroomProvider');
  }
  return context;
};


