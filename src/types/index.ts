export interface bodyRequestEmail {
  type_send: "teachers" | "students";
  subject: string;
  content: string;
  files: Array<File>;
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
  values: string[];
  total: number | undefined;
}
export interface File {
  filename: string;
  content: string;
  encoding: "base64";
}
export interface CommonError {
  message?: string;
  code?: number;
}
