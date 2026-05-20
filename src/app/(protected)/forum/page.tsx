'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export default function ForumPage() {
  const handleCreateSummary = () => {
    alert('פתיחת ממשק להזנת סיכום יומי ויצירת הודעת WhatsApp (יושק מלא במקצה MVP 2)...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="פורום מוביל וסיכומים" 
        subtitle="מרכז שיתוף סיכומי מפקדים יומיים, דיווחי נוכחות ומדדי ת״ש ורפואה. מיועד ליצירת סנכרון מהיר בין מפקדי המחלקות למפקד הפלוגה."
      />

      {/* Empty State Showcase */}
      <div className="py-10">
        <EmptyState 
          icon={MessageSquare}
          title="טרם פורסמו סיכומי מפקדים להיום"
          description="מפקדי המחלקות טרם הגישו את דיווח הסטטוס היומי שלהם לפורום הפלוגתי. הסיכום משמש ליצירת פורמט הודעת סגירת יום פלוגתית מובנית."
          actionText="פרסם סיכום מפקד חדש"
          onAction={handleCreateSummary}
        />
      </div>
    </div>
  );
}
