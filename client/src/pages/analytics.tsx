import React, { useMemo } from 'react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { TrendingUp, Euro, Target, Clock, AlertTriangle } from 'lucide-react';
import { ProjectStatus } from '@/types';

const STAGE_META: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'lead',           label: 'Prospection',   color: '#94a3b8' },
  { id: 'visit',          label: 'Visite',         color: '#60a5fa' },
  { id: 'quote',          label: 'Devis',          color: '#f59e0b' },
  { id: 'creos',          label: 'CREOS',          color: '#a78bfa' },
  { id: 'installation',   label: 'Installation',   color: '#10b981' },
  { id: 'raccordement',   label: 'Raccordement',   color: '#6366f1' },
  { id: 'completed',      label: 'Terminé',        color: '#475569' },
];

function conversionColor(rate: number) {
  if (rate >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (rate >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-500 bg-red-50 border-red-200';
}

export default function Analytics() {
  const { projects } = useProjects();

  const { funnelData, totalPipeline, avgDeal, completedValue, stuckCount, stuckValue, maxCount } = useMemo(() => {
    const funnelData = STAGE_META.map(s => {
      const sp = projects.filter(p => p.status === s.id);
      return {
        stage: s.label,
        value: sp.reduce((acc, p) => acc + p.value, 0),
        count: sp.length,
        color: s.color,
        avgDays: sp.length ? Math.round(sp.reduce((acc, p) => acc + p.daysInStage, 0) / sp.length) : 0,
      };
    });
    const totalPipeline = projects.reduce((acc, p) => acc + p.value, 0);
    const avgDeal = projects.length ? Math.round(totalPipeline / projects.length) : 0;
    const completedValue = projects.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.value, 0);
    const stuck = projects.filter(p => p.status !== 'completed' && p.daysInStage >= 14);
    const stuckCount = stuck.length;
    const stuckValue = stuck.reduce((acc, p) => acc + p.value, 0);
    const maxCount = Math.max(...funnelData.map(s => s.count), 1);
    return { funnelData, totalPipeline, avgDeal, completedValue, stuckCount, stuckValue, maxCount };
  }, [projects]);

  const conversionRates = useMemo(() =>
    funnelData.slice(0, -1).map((s, i) => ({
      rate: s.count > 0 ? Math.round((funnelData[i + 1].count / s.count) * 100) : 0,
    })),
    [funnelData]
  );

  const slowestStage = useMemo(() => {
    const active = funnelData.slice(0, 6).filter(s => s.count > 0);
    if (!active.length) return null;
    return active.reduce((prev, curr) => curr.avgDays > prev.avgDays ? curr : prev);
  }, [funnelData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Analytics</h1>
        <p className="text-slate-500 text-sm">Vue d'ensemble du pipeline commercial · données en temps réel</p>
      </div>

      {/* 5 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard label="Valeur pipeline" value={formatCurrency(totalPipeline)} icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} bg="bg-emerald-50" />
        <SummaryCard label="Ticket moyen" value={formatCurrency(avgDeal)} icon={<Euro className="h-5 w-5 text-blue-500" />} bg="bg-blue-50" />
        <SummaryCard label="Projets clôturés" value={formatCurrency(completedValue)} icon={<Target className="h-5 w-5 text-purple-500" />} bg="bg-purple-50" />
        <SummaryCard label="Bloqués +14 jours" value={String(stuckCount)} icon={<Clock className="h-5 w-5 text-amber-500" />} bg="bg-amber-50" suffix="projets" />
        <SummaryCard label="Valeur bloquée" value={formatCurrency(stuckValue)} icon={<AlertTriangle className="h-5 w-5 text-red-500" />} bg="bg-red-50" />
      </div>

      {/* Horizontal bar — value per stage */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-700">Valeur par étape (€)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart layout="vertical" data={funnelData} margin={{ top: 4, right: 90, left: 8, bottom: 4 }}>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={v => `€${(v / 1000).toFixed(0)}k`}
                axisLine={false} tickLine={false}
              />
              <YAxis
                type="category" dataKey="stage"
                tick={{ fontSize: 12, fontWeight: 600, fill: '#475569' }}
                width={58} axisLine={false} tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [formatCurrency(v), 'Valeur']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={34}>
                {funnelData.map((e, i) => <Cell key={i} fill={e.color} />)}
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(v: number) => `${v} proj.`}
                  style={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funnel with proportional bars + color-coded conversion rates */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-700">Funil de conversion</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-2">
            {funnelData.map((s, i) => {
              const widthPct = maxCount > 0 ? Math.max((s.count / maxCount) * 100, 8) : 8;
              const rate = i < conversionRates.length ? conversionRates[i].rate : null;
              return (
                <div key={s.stage}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-20 text-right shrink-0">{s.stage}</span>
                    <div className="flex-1 relative h-8 bg-slate-50 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                        style={{ width: `${widthPct}%`, backgroundColor: s.color, opacity: 0.85 }}
                      >
                        <span className="text-white text-xs font-bold whitespace-nowrap">
                          {s.count} proj.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 w-20 shrink-0">{formatCurrency(s.value)}</span>
                  </div>
                  {rate !== null && (
                    <div className="flex items-center gap-3 my-1">
                      <span className="w-20" />
                      <div className="flex-1 flex items-center gap-1.5 pl-2">
                        <span className="text-slate-200 text-xs">↓</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${conversionColor(rate)}`}>
                          {rate}% passage
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Avg days in stage */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-700">Jours moyens par étape (hors terminé)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData.slice(0, 6)} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="j" />
              <Tooltip
                formatter={(v: number) => [`${v} jours`, 'Moy. jours']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="avgDays" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {funnelData.slice(0, 6).map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                <LabelList
                  dataKey="avgDays"
                  position="top"
                  formatter={(v: number) => `${v}j`}
                  style={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {slowestStage && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              Étape la plus longue : <span className="font-semibold text-slate-600">{slowestStage.stage}</span> avec {slowestStage.avgDays} jours en moyenne
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const SummaryCard = React.memo(function SummaryCard({
  label, value, icon, bg, suffix,
}: { label: string; value: string; icon: React.ReactNode; bg: string; suffix?: string }) {
  return (
    <Card className="border-white/60 shadow-sm">
      <CardContent className="p-5">
        <div className={`inline-flex p-2 rounded-xl mb-3 ${bg}`}>{icon}</div>
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {suffix && <p className="text-xs text-slate-400 mt-0.5">{suffix}</p>}
      </CardContent>
    </Card>
  );
});
