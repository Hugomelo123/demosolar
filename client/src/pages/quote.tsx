import React from 'react';
import { QuoteForm } from '@/components/QuoteForm';
import { opsCopy } from '@/config/opsCopy';
import { Sun } from 'lucide-react';
import { demo } from '@/config/demo';

export default function QuotePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-8 md:px-10 md:py-10 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sun className="h-7 w-7 text-amber-200" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {opsCopy.quoteHeadline}
                </h1>
                <p className="text-emerald-100 text-sm md:text-base mt-0.5">
                  {opsCopy.quoteSubline}
                </p>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium">
            {demo.companyName}
          </p>
        </div>
      </header>

      <QuoteForm />
    </div>
  );
}
