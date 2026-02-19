import React from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { Navbar } from '@/components/Navbar';
import { ProjectsProvider } from '@/components/Providers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectsProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 font-sans text-slate-900">
        <DemoBanner />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-20">
          {children}
        </main>
      </div>
    </ProjectsProvider>
  );
}
