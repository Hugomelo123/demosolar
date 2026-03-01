import React, { useMemo } from 'react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { TrendingUp, Euro, Target, Clock } from 'lucide-react';
import { ProjectStatus } from '@/types';

const STAGE_META: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'lead',         label: 'Lead',    color: '#94a3b8' },
  { id: 'visit',        label: 'Visite',  color: '#60a5fa' },
  { id: 'quote',        label: 'Devis',   color: '#f59e0b' },
  { id: 'creos',        label: 'CREOS',   color: '#a78bfa' },
  { id: 'installation', label: 'Install', color: '#10b981' },
  { id: 'completed',    label: 'Terminé', color: '#475569' },
];

export default function Analytics() {
  const { projects } = useProjects();

  const { funnelData, totalPipeline, avgDeal, completedValue, stuckCount } = useMemo(() => {
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
    const stuckCount = projects.filter(p => p.status !== 'completed' && p.daysInStage >= 14).length;
    return { funnelData, totalPipeline, avgDeal, completedValue, stuckCount };
  }, [projects]);

  const conversionRates = useMemo(() =>
    funnelData.slice(0, -1).map((s, i) => ({
      rate: s.count > 0 ? Math.round((funnelData[i + 1].count / s.count) * 100) : 0,
    })),
    [funnelData]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Analytics</h1>
        <p className="text-slate-500 text-sm">Vue d'ensemble du pipeline commercial · données en temps réel</p>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Valeur pipeline" value={formatCurrency(totalPipeline)} icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} bg="bg-emerald-50" />
        <SummaryCard label="Ticket moyen" value={formatCurrency(avgDeal)} icon={<Euro className="h-5 w-5 text-blue-500" />} bg="bg-blue-50" />
        <SummaryCard label="Projets clôturés" value={formatCurrency(completedValue)} icon={<Target className="h-5 w-5 text-purple-500" />} bg="bg-purple-50" />
        <SummaryCard label="Bloqués +14 jours" value={String(stuckCount)} icon={<Clock className="h-5 w-5 text-amber-500" />} bg="bg-amber-50" suffix="projets" />
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

      {/* Pipeline flow with conversion rates */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-700">Distribution · taux de progression</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {funnelData.map((s, i) => (
              <React.Fragment key={s.stage}>
                <div className="flex flex-col items-center gap-1.5 min-w-[68px]">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.count}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 text-center">{s.stage}</span>
                  <span className="text-[11px] text-slate-400 text-center">{formatCurrency(s.value)}</span>
                </div>
                {i < funnelData.length - 1 && (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-bold text-slate-500">{conversionRates[i].rate}%</span>
                    <span className="text-slate-300 text-base">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avg days in stage — bar chart */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-700">Jours moyens par étape (hors terminé)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData.slice(0, 5)} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="j" />
              <Tooltip
                formatter={(v: number) => [`${v} jours`, 'Moy. jours']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="avgDays" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {funnelData.slice(0, 5).map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                <LabelList
                  dataKey="avgDays"
                  position="top"
                  formatter={(v: number) => `${v}j`}
                  style={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
