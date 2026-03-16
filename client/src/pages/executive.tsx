import React from 'react';
import { useProjects } from '@/components/Providers';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, Zap, Users, CheckCircle2, AlertTriangle,
  Target, Award, ArrowUpRight,
} from 'lucide-react';

const MONTHLY_REVENUE = [
  { month: 'Sep',  revenue: 148000, projects: 6 },
  { month: 'Oct',  revenue: 172000, projects: 7 },
  { month: 'Nov',  revenue: 134000, projects: 5 },
  { month: 'Déc',  revenue: 98000,  projects: 4 },
  { month: 'Jan',  revenue: 165000, projects: 7 },
  { month: 'Fév',  revenue: 189000, projects: 8 },
  { month: 'Mar',  revenue: 214000, projects: 9 },
];

const TEAM_PERFORMANCE = [
  { name: 'Équipe Nord',  projects: 22, revenue: 310000, kwp: 287, color: '#10b981' },
  { name: 'Équipe Sud',   projects: 18, revenue: 268000, kwp: 241, color: '#6366f1' },
  { name: 'Équipe A',     projects: 31, revenue: 0,       kwp: 389, color: '#f59e0b' },
  { name: 'Équipe B',     projects: 27, revenue: 0,       kwp: 318, color: '#3b82f6' },
];

const REGIONAL_DATA = [
  { region: 'Luxembourg-Ville', projects: 18, share: 36 },
  { region: 'Esch-sur-Alzette', projects: 12, share: 24 },
  { region: 'Differdange',      projects: 8,  share: 16 },
  { region: 'Dudelange',        projects: 7,  share: 14 },
  { region: 'Autres',           projects: 5,  share: 10 },
];

export default function ExecutiveDashboard() {
  const { projects } = useProjects();

  const completed = projects.filter(p => p.status === 'completed');
  const active    = projects.filter(p => p.status !== 'completed');
  const atRisk    = active.filter(p => p.daysInStage >= 14 || p.lastContactDaysAgo >= 10);

  const totalRevenue    = completed.reduce((a, p) => a + p.value, 0);
  const pipelineValue   = active.reduce((a, p) => a + p.value, 0);
  const totalKwp        = completed.reduce((a, p) => a + p.kwp, 0);
  const conversionRate  = projects.length
    ? Math.round((completed.length / projects.length) * 100) : 0;
  const avgDeal         = projects.length
    ? Math.round((totalRevenue + pipelineValue) / projects.length) : 0;

  // YTD revenue = simulated sum
  const ytdRevenue = MONTHLY_REVENUE.reduce((a, m) => a + m.revenue, 0);
  const ytdTarget  = 1_800_000;
  const ytdPct     = Math.min(Math.round((ytdRevenue / ytdTarget) * 100), 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Vue Direction</h1>
            <p className="text-slate-500 text-sm">Synthèse exécutive · KPIs stratégiques · Mars 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
              Objectif annuel : {ytdPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Annual target progress */}
      <Card className="border-white/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Objectif annuel 2026</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(ytdRevenue)}</p>
              <p className="text-xs text-slate-400 mt-0.5">sur {formatCurrency(ytdTarget)} ({ytdPct}%)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Pipeline prévisionnel</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(pipelineValue)}</p>
              <p className="text-xs text-slate-400">à clôturer</p>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${ytdPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-slate-400">0 €</span>
            <span className="text-[11px] text-slate-400">{formatCurrency(ytdTarget)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenus clôturés',   value: formatCurrency(totalRevenue),    sub: `${completed.length} projets terminés`, icon: <Award className="h-4 w-4 text-emerald-500" />,  bg: 'bg-emerald-50', trend: '+18%', up: true },
          { label: 'Pipeline actif',      value: formatCurrency(pipelineValue),   sub: `${active.length} projets en cours`,    icon: <TrendingUp className="h-4 w-4 text-blue-500" />,  bg: 'bg-blue-50',    trend: '+12%', up: true },
          { label: 'kWc installés',       value: `${totalKwp.toFixed(0)} kWc`,   sub: 'Capacité totale posée',                icon: <Zap className="h-4 w-4 text-amber-500" />,         bg: 'bg-amber-50',   trend: '+22%', up: true },
          { label: 'Taux de conversion',  value: `${conversionRate}%`,            sub: `Ticket moyen ${formatCurrency(avgDeal)}`, icon: <Target className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-50',  trend: conversionRate >= 15 ? '+3pts' : '-2pts', up: conversionRate >= 15 },
        ].map(k => (
          <Card key={k.label} className="border-white/60 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${k.bg}`}>{k.icon}</div>
              <p className="text-xs text-slate-500 font-medium mb-1">{k.label}</p>
              <p className="text-xl font-bold text-slate-900 leading-tight">{k.value}</p>
              <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                <ArrowUpRight className={`h-3 w-3 ${k.up ? '' : 'rotate-180'}`} />
                {k.trend} vs mois précédent
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly revenue */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-700">Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Revenus']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team performance */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-700">Performance par équipe</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={TEAM_PERFORMANCE} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`${v}`, 'Projets']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="projects" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {TEAM_PERFORMANCE.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: regional + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Regional breakdown */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              Répartition géographique
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {REGIONAL_DATA.map(r => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{r.region}</span>
                  <span className="text-sm font-bold text-slate-800">{r.projects} projets · {r.share}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${r.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strategic alerts */}
        <Card className="border-white/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-slate-400" />
              Alertes stratégiques
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[
              {
                title: `${atRisk.length} projets à risque`,
                desc: 'Sans contact depuis +14 jours ou bloqués en étape',
                severity: atRisk.length > 3 ? 'red' : atRisk.length > 0 ? 'amber' : 'green',
                value: atRisk.length > 0 ? `${formatCurrency(atRisk.reduce((a, p) => a + p.value, 0))} en jeu` : 'Aucun',
              },
              {
                title: 'Objectif Q1 : 89%',
                desc: 'Mars 2026 — en bonne voie pour atteindre la cible',
                severity: 'green',
                value: formatCurrency(214000),
              },
              {
                title: 'Délai CREOS : +18 jours moy.',
                desc: 'Temps moyen d\'attente autorisation réseau (baseline 14j)',
                severity: 'amber',
                value: '4j de retard',
              },
              {
                title: 'Taux de conversion stable',
                desc: `${conversionRate}% — dans la fourchette cible (15–25%)`,
                severity: conversionRate >= 15 ? 'green' : 'amber',
                value: `${conversionRate}%`,
              },
            ].map(a => {
              const colors = {
                green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
                amber: 'bg-amber-50 border-amber-100 text-amber-700',
                red:   'bg-red-50 border-red-100 text-red-600',
              };
              const dots = { green: 'bg-emerald-400', amber: 'bg-amber-400', red: 'bg-red-400' };
              return (
                <div key={a.title} className={`flex items-center gap-3 p-3 rounded-xl border ${colors[a.severity as keyof typeof colors]}`}>
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dots[a.severity as keyof typeof dots]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs opacity-80 mt-0.5">{a.desc}</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0">{a.value}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-400 text-center pb-2">
        Vue Direction — accès restreint · données en temps réel · mis à jour automatiquement
      </p>
    </div>
  );
}
