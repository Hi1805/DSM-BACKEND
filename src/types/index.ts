export interface bodyRequestEmail {
  email: string;
  subject: string;
  content: string;
  files: string[];
}
export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  Class?: string;
  address: string;
  grade?: number;
}
export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  Class?: string;
  address: string;
  grade?: number;
}
export interface ClassesResponse {
  grade: number;
  value: string[];
}
