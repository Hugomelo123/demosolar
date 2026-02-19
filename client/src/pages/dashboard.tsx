import React from 'react';
import { StatsCard } from '@/components/StatsCard';
import { BottleneckAlert } from '@/components/BottleneckAlert';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Users, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const { projects } = useProjects();

  // Calculate metrics
  const newLeads = projects.filter(p => p.status === 'lead').length;
  const quotesSent = projects.filter(p => p.status === 'quote').length;
  const creosApproved = projects.filter(p => p.status === 'creos' || p.status === 'installation' || p.status === 'completed').length;
  const pipelineValue = projects.reduce((acc, p) => acc + p.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="New Leads" 
          value={newLeads.toString()} 
          change="+3" 
          trend="up" 
          icon={<Users className="h-6 w-6 text-emerald-500" />} 
        />
        <StatsCard 
          title="Quotes Sent" 
          value={quotesSent.toString()} 
          change="-1" 
          trend="down" 
          icon={<FileText className="h-6 w-6 text-blue-500" />} 
        />
        <StatsCard 
          title="CREOS Approved" 
          value={creosApproved.toString()} 
          change="+2" 
          trend="up" 
          icon={<CheckCircle2 className="h-6 w-6 text-purple-500" />} 
        />
        <StatsCard 
          title="Pipeline Value" 
          value={formatCurrency(pipelineValue)} 
          change="+15%" 
          trend="up" 
          icon={<TrendingUp className="h-6 w-6 text-amber-500" />} 
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Operational Bottlenecks</h2>
        <BottleneckAlert />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Project Pipeline</h2>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
}
