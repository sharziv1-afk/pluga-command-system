'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Truck } from 'lucide-react';

export default function RequestsPage() {
  const handleCreateRequest = () => {
    alert('פתיחת טופס להגשת דרישת אספקה טקטית (יושק מלא במקצה MVP 2)...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="דרישות לוגיסטיקה ואספקה" 
        subtitle="מרכז הגשת דרישות ציוד טקטי, מנות קרב, דלק ותחמושת. הרס״פ ומפקדי המחלקות מנהלים כאן סגירת מעגל לוגיסטית פלוגתית."
      />

      {/* Empty State Showcase */}
      <div className="py-10">
        <EmptyState 
          icon={Truck}
          title="אין דרישות לוגיסטיקה פתוחות"
          description="כל דרישות הציוד, התיקונים והאספקה לפלוגה סופקו בהצלחה או נסגרו על ידי סגל המפל״ג והרס״פ."
          actionText="פתח דרישת אספקה חדשה"
          onAction={handleCreateRequest}
        />
      </div>
    </div>
  );
}
