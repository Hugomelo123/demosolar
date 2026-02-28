import React, { useMemo } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { BottleneckAlert } from '@/components/BottleneckAlert';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Users, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';
import { opsCopy } from '@/config/opsCopy';

export default function Dashboard() {
  const { projects } = useProjects();

  const { newLeads, quotesSent, creosOrLater, pipelineValue, valueInPipeline, valueStuck14, noContactCount } = useMemo(() => {
    const inPipeline = projects.filter(p => p.status !== 'completed');
    return {
      newLeads: projects.filter(p => p.status === 'lead').length,
      quotesSent: projects.filter(p => p.status === 'quote').length,
      creosOrLater: projects.filter(p => p.status === 'creos' || p.status === 'installation' || p.status === 'completed').length,
      pipelineValue: projects.reduce((acc, p) => acc + p.value, 0),
      valueInPipeline: inPipeline.reduce((acc, p) => acc + p.value, 0),
      valueStuck14: inPipeline.filter(p => p.daysInStage >= 14).reduce((acc, p) => acc + p.value, 0),
      noContactCount: inPipeline.filter(p => (p.lastContactDaysAgo ?? 0) >= 14).length,
    };
  }, [projects]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 30-second value: control panel + funnel */}
      <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {opsCopy.dashboardHeadline}
        </h1>
        <p className="text-slate-600 mb-4 max-w-2xl">
          {opsCopy.dashboardSubline}
        </p>
        <p className="text-sm font-medium text-slate-500 tracking-wide">
          {opsCopy.funnelSteps}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title={opsCopy.metricLeads} 
          value={newLeads.toString()} 
          icon={<Users className="h-6 w-6 text-emerald-500" />} 
        />
        <StatsCard 
          title={opsCopy.metricDevisSent} 
          value={quotesSent.toString()} 
          icon={<FileText className="h-6 w-6 text-blue-500" />} 
        />
        <StatsCard 
          title={opsCopy.metricCreosPipeline} 
          value={creosOrLater.toString()} 
          icon={<CheckCircle2 className="h-6 w-6 text-purple-500" />} 
        />
        <StatsCard 
          title={opsCopy.metricPipelineValue} 
          value={formatCurrency(pipelineValue)} 
          icon={<TrendingUp className="h-6 w-6 text-amber-500" />} 
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">{opsCopy.bottleneckTitle}</h2>
        <BottleneckAlert />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-slate-100/80 border border-slate-200 px-4 py-3 text-sm">
          <span className="font-semibold text-slate-700">
            💰 {opsCopy.summaryInPipeline(formatCurrency(valueInPipeline))}
          </span>
          <span className="text-slate-600">
            ⏳ {opsCopy.summaryStuck14(formatCurrency(valueStuck14))}
          </span>
          {noContactCount > 0 && (
            <span className="text-amber-700 font-medium">
              ⚠ {opsCopy.summaryNoContact(noContactCount)}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{opsCopy.pipelineTitle}</h2>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
}
