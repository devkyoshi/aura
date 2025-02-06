export interface IClassroomResponse {
  classroom_id: string;
  title: string;
  description?: string;
  price?: number;
  grade?: string;
  students_enrolled?: string[];
  category?: string;
  tags?: string[];
  start_time?: string;
  end_time?: string;
  thumbnail?: string;
  published?: boolean;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}