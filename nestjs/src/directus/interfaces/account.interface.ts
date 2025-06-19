export interface StudentAccount {
  id: string;
  student_id: string;
  email: string;
  phone: string;
  university_name: string;
  university_code: string;
  referrer?: string;
  nav?: number;
  rank?: number;
  status?: string;
  account_code?: string;
  internal_note?: string;
}
