import React, { useMemo } from 'react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import {
  TrendingUp, Zap, Target, AlertTriangle,
  Users, CheckCircle2, Clock, BarChart2,
} from 'lucide-react';
import { ProjectStatus } from '@/types';

const STAGE_META: { id: ProjectStatus; label: string; color: string; prob: number }[] = [
  { id: 'lead',          label: 'Prospection', color: '#94a3b8', prob: 0.10 },
  { id: 'visit',         label: 'Visite',       color: '#60a5fa', prob: 0.25 },
  { id: 'quote',         label: 'Devis',        color: '#f59e0b', prob: 0.50 },
  { id: 'creos',         label: 'CREOS',        color: '#a78bfa', prob: 0.75 },
  { id: 'installation',  label: 'Installation', color: '#10b981', prob: 0.90 },
  { id: 'raccordement',  label: 'Raccordement', color: '#6366f1', prob: 0.95 },
  { id: 'completed',     label: 'Terminé',      color: '#475569', prob: 1.00 },
];

const OWNER_COLORS: Record<string, string> = {
  Sales: '#10b981',
  Admin: '#6366f1',
  Team:  '#f59e0b',
};

export default function Analytics() {
  const { projects } = useProjects();

  const data = useMemo(() => {
    const stageById = Object.fromEntries(STAGE_META.map(s => [s.id, s]));

    const funnelData = STAGE_META.map(s => {
      const sp = projects.filter(p => p.status === s.id);
      return {
        ...s,
        value:   sp.reduce((acc, p) => acc + p.value, 0),
        kwp:     sp.reduce((acc, p) => acc + p.kwp,   0),
        count:   sp.length,
        avgDays: sp.length
          ? Math.round(sp.reduce((acc, p) => acc + p.daysInStage, 0) / sp.length)
          : 0,
      };
    });

    const totalPipeline  = projects.reduce((acc, p) => acc + p.value, 0);
    const avgDeal        = projects.length ? Math.round(totalPipeline / projects.length) : 0;
    const completed      = projects.filter(p => p.status === 'completed');
    const active         = projects.filter(p => p.status !== 'completed');
    const completedValue = completed.reduce((acc, p) => acc + p.value, 0);
    const completedKwp   = completed.reduce((acc, p) => acc + p.kwp, 0);
    const pipelineKwp    = active.reduce((acc, p) => acc + p.kwp, 0);

    // Weighted pipeline: each project weighted by its stage probability
    const weightedPipeline = Math.round(
      projects.reduce((acc, p) => acc + p.value * (stageById[p.status]?.prob ?? 0), 0)
    );

    // Conversion rate: completed / total
    const conversionRate = projects.length
      ? Math.round((completed.length / projects.length) * 100)
      : 0;

    // Avg days in current stage across active projects
    const avgCycle = active.length
      ? Math.round(active.reduce((acc, p) => acc + p.daysInStage, 0) / active.length)
      : 0;

    const atRisk = projects
      .filter(p => p.status !== 'completed' && (p.daysInStage >= 14 || p.lastContactDaysAgo >= 10))
      .sort((a, b) => b.value - a.value);

    const stuckValue = atRisk.reduce((acc, p) => acc + p.value, 0);

    const ownerBreakdown = ['Sales', 'Admin', 'Team'].map(o => ({
      owner: o,
      count: active.filter(p => p.owner === o).length,
      value: active.filter(p => p.owner === o).reduce((acc, p) => acc + p.value, 0),
      color: OWNER_COLORS[o],
    }));

    const maxCount = Math.max(...funnelData.map(s => s.count), 1);

    const slowestStage = funnelData
      .slice(0, 6)
      .filter(s => s.count > 0)
      .reduce((prev, curr) => (curr.avgDays > prev.avgDays ? curr : prev), funnelData[0]);

    const healthScore = atRisk.length === 0 ? 'good'
      : atRisk.length <= 2 ? 'warning'
      : 'alert';

    return {
      funnelData, totalPipeline, avgDeal, completedValue, completedKwp, pipelineKwp,
      weightedPipeline, conversionRate, avgCycle,
      atRisk, stuckValue, ownerBreakdown, maxCount, slowestStage, healthScore,
      totalProjects: projects.length, completedCount: completed.length, activeCount: active.length,
    };
  }, [projects]);

  const healthBadge = {
    good:    { label: 'Pipeline sain',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    warning: { label: 'Attention requise', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    alert:   { label: 'Projets bloqués',   cls: 'bg-red-50 text-red-600 border-red-200' },
  }[data.healthScore];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Analytics</h1>
          <p className="text-slate-500 text-sm">Vue d'ensemble du pipeline commercial · données en temps réel</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${healthBadge.cls}`}>
          {healthBadge.label}
        </span>
      </div>

      {/* Row 1 — Financial KPIs */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-0.5">Financier</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Pipeline total"
            value={formatCurrency(data.totalPipeline)}
            context={`${data.totalProjects} projets en cours`}
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
            bg="bg-emerald-50"
          />
          <KpiCard
            label="Pipeline pondéré"
            value={formatCurrency(data.weightedPipeline)}
            context="Estimation réaliste de revenus"
            icon={<Target className="h-4 w-4 text-blue-500" />}
            bg="bg-blue-50"
            tooltip="Chaque projet est pondéré par la probabilité de clôture de son étape (10 % Prospection → 95 % Raccordement)"
          />
          <KpiCard
            label="Revenus clôturés"
            value={formatCurrency(data.completedValue)}
            context={`${data.completedCount} projet${data.completedCount > 1 ? 's' : ''} terminé${data.completedCount > 1 ? 's' : ''}`}
            icon={<CheckCircle2 className="h-4 w-4 text-purple-500" />}
            bg="bg-purple-50"
          />
          <KpiCard
            label="Ticket moyen"
            value={formatCurrency(data.avgDeal)}
            context="Valeur moyenne par projet"
            icon={<BarChart2 className="h-4 w-4 text-indigo-500" />}
            bg="bg-indigo-50"
          />
        </div>
      </div>

      {/* Row 2 — Operational KPIs */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-0.5">Opérationnel</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Taux de conversion"
            value={`${data.conversionRate} %`}
            context={`${data.completedCount} / ${data.totalProjects} projets clôturés`}
            icon={<Target className="h-4 w-4 text-emerald-500" />}
            bg="bg-emerald-50"
            valueColor={data.conversionRate >= 15 ? 'text-emerald-700' : data.conversionRate >= 8 ? 'text-amber-600' : 'text-red-600'}
          />
          <KpiCard
            label="kWc installés"
            value={`${data.completedKwp.toFixed(1)} kWc`}
            context="Puissance réellement posée"
            icon={<Zap className="h-4 w-4 text-amber-500" />}
            bg="bg-amber-50"
          />
          <KpiCard
            label="kWc en pipeline"
            value={`${data.pipelineKwp.toFixed(1)} kWc`}
            context="Puissance à poser"
            icon={<Zap className="h-4 w-4 text-blue-500" />}
            bg="bg-blue-50"
          />
          <KpiCard
            label="Projets à risque"
            value={String(data.atRisk.length)}
            context={`${formatCurrency(data.stuckValue)} en jeu`}
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            bg="bg-red-50"
            valueColor={data.atRisk.length === 0 ? 'text-emerald-600' : data.atRisk.length <= 2 ? 'text-amber-600' : 'text-red-600'}
          />
        </div>
      </div>

      {/* Row 3 — Stage table + At-risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pipeline stages table */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Vue par étape</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-slate-100">
              {data.funnelData.map(s => (
                <div key={s.id} className="py-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28 flex-shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-sm font-medium text-slate-700 truncate">{s.label}</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color + '22', color: s.color }}
                  >
                    {s.count}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${data.maxCount > 0 ? (s.count / data.maxCount) * 100 : 0}%`,
                        backgroundColor: s.color,
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <div className="text-right flex-shrink-0 w-32">
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(s.value)}</p>
                    <p className="text-[11px] text-slate-400">
                      {s.kwp > 0 ? `${s.kwp.toFixed(1)} kWc` : '—'}
                      {s.avgDays > 0 ? ` · ${s.avgDays}j moy.` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-risk projects */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              Projets à surveiller
              {data.atRisk.length > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
                  {data.atRisk.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {data.atRisk.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-400" />
                <p className="text-sm font-medium">Aucun projet bloqué</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.atRisk.map(p => {
                  const stageLabel = STAGE_META.find(s => s.id === p.status)?.label ?? p.status;
                  const stageColor = STAGE_META.find(s => s.id === p.status)?.color ?? '#94a3b8';
                  const isUrgent = p.daysInStage >= 21 || p.lastContactDaysAgo >= 14;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
                        isUrgent ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: stageColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{p.clientName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {stageLabel} · {p.daysInStage}j dans étape · dernier contact {p.lastContactDaysAgo}j
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-slate-800 text-xs">{formatCurrency(p.value)}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${isUrgent ? 'text-red-500' : 'text-amber-600'}`}>
                          {isUrgent ? 'Urgent' : 'À relancer'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Avg days + Owner breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-white/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-700">Jours moyens par étape</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.funnelData.slice(0, 6)} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="j" />
                <Tooltip
                  formatter={(v: number) => [`${v} jours`, 'Moy.']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="avgDays" radius={[6, 6, 0, 0]} maxBarSize={44}>
                  {data.funnelData.slice(0, 6).map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                  <LabelList
                    dataKey="avgDays"
                    position="top"
                    formatter={(v: number) => `${v}j`}
                    style={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {data.slowestStage && data.slowestStage.avgDays > 0 && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                Étape la plus longue :
                {' '}<span className="font-semibold text-slate-600">{data.slowestStage.label}</span>
                {' '}avec {data.slowestStage.avgDays} jours en moyenne
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              Par responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            {data.ownerBreakdown.map(o => {
              const total = data.ownerBreakdown.reduce((a, b) => a + b.count, 0);
              return (
                <div key={o.owner}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: o.color }} />
                      <span className="text-sm font-semibold text-slate-700">{o.owner}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700">{o.count} proj.</span>
                      <span className="text-xs text-slate-400 ml-1.5">{formatCurrency(o.value)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${total > 0 ? (o.count / total) * 100 : 0}%`,
                        backgroundColor: o.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const KpiCard = React.memo(function KpiCard({
  label, value, context, icon, bg, valueColor, tooltip,
}: {
  label: string;
  value: string;
  context?: string;
  icon: React.ReactNode;
  bg: string;
  valueColor?: string;
  tooltip?: string;
}) {
  return (
    <Card className="border-white/60 shadow-sm" title={tooltip}>
      <CardContent className="p-5">
        <div className={`inline-flex p-2 rounded-xl mb-3 ${bg}`}>{icon}</div>
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className={`text-xl font-bold leading-tight ${valueColor ?? 'text-slate-900'}`}>{value}</p>
        {context && <p className="text-xs text-slate-400 mt-1">{context}</p>}
      </CardContent>
    </Card>
  );
});
