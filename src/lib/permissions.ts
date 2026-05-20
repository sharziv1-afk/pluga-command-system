import { RoleType, FrameType } from './types';

// Role weights to compare hierarchical levels
export const ROLE_WEIGHTS: Record<RoleType, number> = {
  'מ"פ': 100,
  'סמ"פ': 90,
  'רס"פ': 80,
  'מ"מ': 70,
  'מ"כ': 50,
};

// Check if a role is higher or equal to another
export function isHigherOrEqualRole(role1: RoleType, role2: RoleType): boolean {
  return ROLE_WEIGHTS[role1] >= ROLE_WEIGHTS[role2];
}

// Check if frame matches or is a subframe (e.g. מחלקה 1 covers כיתה 1 if assigned appropriately)
export function isFrameCovered(userFrame: FrameType, targetFrame: FrameType): boolean {
  if (userFrame === 'פלוגה' || userFrame === 'מפל"ג') return true;
  if (userFrame === targetFrame) return true;
  
  // Custom logic: e.g. מחלקה 1 covers כיתה 1 if needed, but for simplicity:
  return false;
}

// Permision check for Admin Panel
export function canAccessAdminPanel(role: RoleType): boolean {
  return role === 'מ"פ' || role === 'סמ"פ';
}

// Permission check for managing Tasks
export function canManageTasks(role: RoleType, userFrame: FrameType, taskFrame: FrameType): boolean {
  // MP and SMP can manage anything
  if (role === 'מ"פ' || role === 'סמ"פ') return true;
  
  // RSAP can manage logistics/admin tasks
  if (role === 'רס"פ') return true; // RSAP is global logistics
  
  // MM can manage their own department
  if (role === 'מ"מ') {
    return userFrame === taskFrame || taskFrame.startsWith('כיתה'); // MM can edit class tasks too
  }
  
  // MK can only edit their own exact frame/class
  if (role === 'מ"כ') {
    return userFrame === taskFrame;
  }
  
  return false;
}

// Permission check for creating tasks (everyone can create tasks within their frame)
export function canCreateTask(role: RoleType): boolean {
  return true;
}

// Permission check for managing Gaps
export function canManageGaps(role: RoleType, userFrame: FrameType, gapFrame: FrameType): boolean {
  if (role === 'מ"פ' || role === 'סמ"פ' || role === 'רס"פ') return true;
  return userFrame === gapFrame;
}

// Permission check for managing logistics requests
export function canManageLogistics(role: RoleType, userFrame: FrameType, requestFrame: FrameType): boolean {
  // RSAP is the supreme logistics commander
  if (role === 'רס"פ' || role === 'מ"פ' || role === 'סמ"פ') return true;
  return userFrame === requestFrame;
}

// Permission check for daily summaries (Forum)
export function canApproveForum(role: RoleType): boolean {
  return role === 'מ"פ' || role === 'סמ"פ';
}

export function canSubmitForum(role: RoleType): boolean {
  return role === 'מ"מ' || role === 'רס"פ' || role === 'סמ"פ' || role === 'מ"פ';
}
