export interface IClassroomRequest {
  title: string; // Required
  instructor: string; // Required
  grade: string; // Required
  category: string; // Required
  description?: string;
  price?: number;
  passcode?: string;
  lesson?: string[];
  students_enrolled?: string[];
  tags?: string[];
  start_time?: string;
  end_time?: string;
  thumbnail?: string;
  published?: boolean;
  is_private?: boolean;
}

export interface IClassroomResponse {
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
