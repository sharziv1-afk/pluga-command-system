'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  const handleCreateTask = () => {
    alert('פתיחת טופס ליצירת משימה פלוגתית חדשה (יושק מלא במקצה MVP 2)...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="משימות ובקרה פלוגתית" 
        subtitle="מעקב, פתיחה וניהול משימות המוקצות למחלקות, כיתות ולסגל המפל״ג. כאן תוכל לראות סיבות תקיעה, בקרות מפקד ולייצא קובצי לו״ז."
      />

      {/* Empty State Showcase */}
      <div className="py-10">
        <EmptyState 
          icon={CheckSquare}
          title="אין משימות פעילות התואמות לסינון הנוכחי"
          description="המחלקה שלך עומדת ביעדים! כל המשימות, בקרות המפקד ומבדקי הכשירות הושלמו או שטרם הוקצו משימות חדשות על ידי המפקד."
          actionText="צור משימה פלוגתית חדשה"
          onAction={handleCreateTask}
        />
      </div>
    </div>
  );
}
