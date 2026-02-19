import React from 'react';
import { QuoteForm } from '@/components/QuoteForm';

export default function QuotePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 pb-2">
          Solar Quote — 5 Minutes
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          Luxembourg Klimabonus 2026 included instantly.
        </p>
      </div>

      <QuoteForm />
    </div>
  );
}
