export interface bodyRequestEmail {
  email: string;
  subject: string;
  content: string;
  files: string[];
}
export interface ProfileTemplate {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  class?: string;
  address: string;
  grade?: number;
}
