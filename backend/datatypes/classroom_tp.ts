export interface IClassroomRequest {
  title: string;
  description: string;
  price?: number;
  instructor: string;
  passcode?: string;
  grade: string;
  lesson?: string[];
  students_enrolled?: string[];
  category: string;
  tags?: string[];
  start_time: string;
  end_time: string;
  thumbnail: string;
  published?: boolean;
  is_private: boolean;
}

export interface IClassroomDTO {
  classroom_id: string;
  title: string;
  description: string;
  price?: number;
  instructor: string;
  grade: string;
  lesson?: string[];
  students_enrolled?: string[];
  category: string;
  tags?: string[];
  start_time: string;
  end_time: string;
  thumbnail: string;
  published?: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
