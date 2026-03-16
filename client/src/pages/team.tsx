import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, Shield, Wrench, TrendingUp, Search,
  CheckCircle2, Clock, AlertTriangle, ChevronDown,
} from 'lucide-react';

type Role = 'Directeur' | 'Manager' | 'Commercial' | 'Technicien' | 'Admin';
type Status = 'active' | 'busy' | 'leave';

interface TeamMember {
  id: string;
  name: string;
  role: Role;
  team: string;
  email: string;
  phone: string;
  status: Status;
  projectsActive: number;
  projectsCompleted: number;
  kwpInstalled: number;
  initials: string;
  color: string;
}

const TEAM: TeamMember[] = [
  { id: '1',  name: 'Hugo Melo',        role: 'Directeur',   team: 'Direction',  email: 'h.melo@solarops.lu',      phone: '+352 691 001',  status: 'active', projectsActive: 0,  projectsCompleted: 0,  kwpInstalled: 0,    initials: 'HM', color: 'from-emerald-400 to-blue-500' },
  { id: '2',  name: 'Sarah Kieffer',    role: 'Manager',     team: 'Nord',       email: 's.kieffer@solarops.lu',   phone: '+352 691 002',  status: 'active', projectsActive: 8,  projectsCompleted: 34, kwpInstalled: 310,  initials: 'SK', color: 'from-blue-400 to-indigo-500' },
  { id: '3',  name: 'Marc Becker',      role: 'Manager',     team: 'Sud',        email: 'm.becker@solarops.lu',    phone: '+352 691 003',  status: 'active', projectsActive: 6,  projectsCompleted: 28, kwpInstalled: 265,  initials: 'MB', color: 'from-purple-400 to-pink-500' },
  { id: '4',  name: 'Julie Schmit',     role: 'Commercial',  team: 'Nord',       email: 'j.schmit@solarops.lu',    phone: '+352 691 004',  status: 'active', projectsActive: 5,  projectsCompleted: 19, kwpInstalled: 0,    initials: 'JS', color: 'from-amber-400 to-orange-500' },
  { id: '5',  name: 'Tom Reding',       role: 'Commercial',  team: 'Nord',       email: 't.reding@solarops.lu',    phone: '+352 691 005',  status: 'busy',   projectsActive: 7,  projectsCompleted: 22, kwpInstalled: 0,    initials: 'TR', color: 'from-teal-400 to-cyan-500' },
  { id: '6',  name: 'Anna Lux',         role: 'Commercial',  team: 'Sud',        email: 'a.lux@solarops.lu',       phone: '+352 691 006',  status: 'active', projectsActive: 4,  projectsCompleted: 15, kwpInstalled: 0,    initials: 'AL', color: 'from-rose-400 to-red-500' },
  { id: '7',  name: 'Pierre Weber',     role: 'Commercial',  team: 'Sud',        email: 'p.weber@solarops.lu',     phone: '+352 691 007',  status: 'active', projectsActive: 6,  projectsCompleted: 18, kwpInstalled: 0,    initials: 'PW', color: 'from-violet-400 to-purple-500' },
  { id: '8',  name: 'Klaus Braun',      role: 'Technicien',  team: 'Équipe A',   email: 'k.braun@solarops.lu',     phone: '+352 691 008',  status: 'busy',   projectsActive: 3,  projectsCompleted: 41, kwpInstalled: 389,  initials: 'KB', color: 'from-slate-400 to-slate-600' },
  { id: '9',  name: 'Luca Ferreira',    role: 'Technicien',  team: 'Équipe A',   email: 'l.ferreira@solarops.lu',  phone: '+352 691 009',  status: 'busy',   projectsActive: 3,  projectsCompleted: 38, kwpInstalled: 356,  initials: 'LF', color: 'from-green-400 to-emerald-500' },
  { id: '10', name: 'Mia Hoffmann',     role: 'Technicien',  team: 'Équipe B',   email: 'm.hoffmann@solarops.lu',  phone: '+352 691 010',  status: 'active', projectsActive: 2,  projectsCompleted: 29, kwpInstalled: 278,  initials: 'MH', color: 'from-blue-400 to-sky-500' },
  { id: '11', name: 'Rui Santos',       role: 'Technicien',  team: 'Équipe B',   email: 'r.santos@solarops.lu',    phone: '+352 691 011',  status: 'active', projectsActive: 2,  projectsCompleted: 25, kwpInstalled: 240,  initials: 'RS', color: 'from-orange-400 to-amber-500' },
  { id: '12', name: 'Nina Müller',      role: 'Technicien',  team: 'Équipe C',   email: 'n.muller@solarops.lu',    phone: '+352 691 012',  status: 'leave',  projectsActive: 0,  projectsCompleted: 22, kwpInstalled: 208,  initials: 'NM', color: 'from-pink-400 to-rose-500' },
  { id: '13', name: 'David Klein',      role: 'Technicien',  team: 'Équipe C',   email: 'd.klein@solarops.lu',     phone: '+352 691 013',  status: 'active', projectsActive: 2,  projectsCompleted: 17, kwpInstalled: 162,  initials: 'DK', color: 'from-indigo-400 to-violet-500' },
  { id: '14', name: 'Emma Wagner',      role: 'Admin',       team: 'Admin',      email: 'e.wagner@solarops.lu',    phone: '+352 691 014',  status: 'active', projectsActive: 0,  projectsCompleted: 0,  kwpInstalled: 0,    initials: 'EW', color: 'from-cyan-400 to-teal-500' },
  { id: '15', name: 'Felix Jacoby',     role: 'Admin',       team: 'Admin',      email: 'f.jacoby@solarops.lu',    phone: '+352 691 015',  status: 'active', projectsActive: 0,  projectsCompleted: 0,  kwpInstalled: 0,    initials: 'FJ', color: 'from-lime-400 to-green-500' },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Directeur:   ['Vue globale', 'Tous les projets', 'Toute l\'équipe', 'Rapports', 'Paramètres', 'Facturation'],
  Manager:     ['Vue équipe', 'Projets d\'équipe', 'Membres d\'équipe', 'Rapports d\'équipe'],
  Commercial:  ['Ses projets', 'Créer devis', 'Pipeline personnel'],
  Technicien:  ['Ses installations', 'Checklist installation', 'Notes terrain'],
  Admin:       ['CREOS & documents', 'Planification', 'Dossiers administratifs'],
};

const ROLE_META: Record<Role, { color: string; bg: string; icon: React.ReactNode }> = {
  Directeur:  { color: 'text-slate-700',   bg: 'bg-slate-100',   icon: <Shield className="h-3.5 w-3.5" /> },
  Manager:    { color: 'text-blue-700',    bg: 'bg-blue-100',    icon: <TrendingUp className="h-3.5 w-3.5" /> },
  Commercial: { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <Users className="h-3.5 w-3.5" /> },
  Technicien: { color: 'text-amber-700',   bg: 'bg-amber-100',   icon: <Wrench className="h-3.5 w-3.5" /> },
  Admin:      { color: 'text-purple-700',  bg: 'bg-purple-100',  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
};

const STATUS_META: Record<Status, { label: string; dot: string }> = {
  active: { label: 'Disponible',  dot: 'bg-emerald-400' },
  busy:   { label: 'En chantier', dot: 'bg-amber-400' },
  leave:  { label: 'Congé',       dot: 'bg-slate-300' },
};

const ROLE_FILTER_OPTIONS: (Role | 'Tous')[] = ['Tous', 'Directeur', 'Manager', 'Commercial', 'Technicien', 'Admin'];

export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'Tous'>('Tous');
  const [expandedRole, setExpandedRole] = useState<Role | null>(null);

  const filtered = TEAM.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.team.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'Tous' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const byRole = ROLE_FILTER_OPTIONS.filter(r => r !== 'Tous') as Role[];

  const stats = {
    total: TEAM.length,
    active: TEAM.filter(m => m.status === 'active').length,
    busy: TEAM.filter(m => m.status === 'busy').length,
    kwp: TEAM.reduce((a, m) => a + m.kwpInstalled, 0),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Gestion de l'équipe</h1>
            <p className="text-slate-500 text-sm">Rôles, accès et performance · {TEAM.length} membres</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow hover:opacity-90 transition-opacity w-fit">
            <Users className="h-4 w-4" />
            Inviter un membre
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Membres total',   value: stats.total,            icon: <Users className="h-4 w-4 text-blue-500" />,    bg: 'bg-blue-50' },
          { label: 'Disponibles',     value: stats.active,           icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-50' },
          { label: 'En chantier',     value: stats.busy,             icon: <Clock className="h-4 w-4 text-amber-500" />,   bg: 'bg-amber-50' },
          { label: 'kWc installés',   value: `${stats.kwp} kWc`,     icon: <TrendingUp className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className="border-white/60 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${s.bg}`}>{s.icon}</div>
              <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles & permissions accordion */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400" />
            Niveaux d'accès par rôle
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {byRole.map(role => {
            const meta = ROLE_META[role];
            const perms = ROLE_PERMISSIONS[role];
            const count = TEAM.filter(m => m.role === role).length;
            const isOpen = expandedRole === role;
            return (
              <div key={role} className="rounded-xl border border-slate-100 overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  onClick={() => setExpandedRole(isOpen ? null : role)}
                >
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bg} ${meta.color}`}>
                    {meta.icon}
                    {role}
                  </span>
                  <span className="text-sm text-slate-500 flex-1">{count} membre{count > 1 ? 's' : ''}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 bg-slate-50/60 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-3 mb-2">Accès autorisés</p>
                    <div className="flex flex-wrap gap-2">
                      {perms.map(p => (
                        <span key={p} className="text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Team list */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-700">Membres de l'équipe</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {/* Role filter */}
              <select
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-700"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as Role | 'Tous')}
              >
                {ROLE_FILTER_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-slate-100">
            {filtered.map(member => {
              const roleMeta = ROLE_META[member.role];
              const statusMeta = STATUS_META[member.status];
              return (
                <div key={member.id} className="py-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${member.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                    {member.initials}
                  </div>
                  {/* Name + role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${roleMeta.bg} ${roleMeta.color}`}>
                        {roleMeta.icon}
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{member.team} · {member.email}</p>
                  </div>
                  {/* Status */}
                  <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                    <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                    <span className="text-xs text-slate-500">{statusMeta.label}</span>
                  </div>
                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6 text-right flex-shrink-0">
                    {member.projectsActive > 0 || member.projectsCompleted > 0 ? (
                      <>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{member.projectsActive}</p>
                          <p className="text-[10px] text-slate-400">actifs</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{member.projectsCompleted}</p>
                          <p className="text-[10px] text-slate-400">terminés</p>
                        </div>
                        {member.kwpInstalled > 0 && (
                          <div>
                            <p className="text-sm font-bold text-slate-800">{member.kwpInstalled} kWc</p>
                            <p className="text-[10px] text-slate-400">installés</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </div>
                  {/* Warning for at-risk */}
                  {member.status === 'leave' && (
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">Aucun membre trouvé</div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-right">{filtered.length} membre{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
        </CardContent>
      </Card>
    </div>
  );
}
