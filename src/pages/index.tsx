import React from 'react';
import { ToastDiagnostic } from '@/components/ToastDiagnostic';

export default function HomePage() {
  return (
    <div>
      <h1>Home Redesign</h1>
      {/* Toast diagnostic to verify toast functionality */}
      <ToastDiagnostic />
      {/* Rest of your page content */}
    </div>
  );
}
