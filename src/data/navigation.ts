import { 
  LayoutDashboard, CheckSquare, Truck, MessageSquare, Shield, HelpCircle 
} from 'lucide-react';

export const navigationItems = [
  {
    name: 'לוח בקרה',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'משימות ובקרה',
    path: '/tasks',
    icon: CheckSquare
  },
  {
    name: 'דרישות לוגיסטיקה',
    path: '/requests',
    icon: Truck
  },
  {
    name: 'פורום מוביל',
    path: '/forum',
    icon: MessageSquare
  },
  {
    name: 'אישור משתמשים',
    path: '/admin',
    icon: Shield
  },
  {
    name: 'עזרה ומדריך',
    path: '/help',
    icon: HelpCircle
  }
];
