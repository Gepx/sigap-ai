export interface Permission {
  id: number;
  uuid: string | null;
  permission_name: string | null;
  route: string | null;
  method: string[];
  is_menu: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}
