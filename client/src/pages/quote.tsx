import React from 'react';
import { QuoteForm } from '@/components/QuoteForm';
import { opsCopy } from '@/config/opsCopy';

export default function QuotePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 pb-2">
          {opsCopy.quoteHeadline}
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          {opsCopy.quoteSubline}
        </p>
      </div>

      <QuoteForm />
    </div>
  );
}
