export type RoleType = 'מ"פ' | 'סמ"פ' | 'מ"מ' | 'מ"כ' | 'רס"פ';

export type FrameType = 
  | 'פלוגה' 
  | 'מפל"ג' 
  | 'מחלקה 1' 
  | 'מחלקה 2' 
  | 'מחלקה 3' 
  | 'מחלקה 4'
  | 'כיתה 1' 
  | 'כיתה 2' 
  | 'כיתה 3' 
  | 'כיתה 4';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: RoleType;
  assigned_frame: FrameType;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: string;
}
