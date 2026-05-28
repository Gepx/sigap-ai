export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  password: string;
  role_id: number;
  avatar: string | null;
  business_name: string;
  business_type: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
