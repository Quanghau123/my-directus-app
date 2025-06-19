import { Expose, Exclude } from 'class-transformer';

export class StudentAccountDto {
  @Expose()
  id!: string;

  @Expose()
  student_id!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  university_name!: string;

  @Expose()
  university_code!: string;

  @Expose()
  referrer?: string;

  @Expose()
  nav?: number;

  @Expose()
  rank?: number;

  @Expose()
  status?: string;

  @Expose()
  account_code?: string;

  @Exclude()
  internal_note?: string;
}
