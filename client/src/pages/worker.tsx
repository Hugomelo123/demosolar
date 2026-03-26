import React from 'react';
import { Link } from 'wouter';
import { useProjects } from '@/components/Providers';
import { MapPin, Zap, Phone, HardHat, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

const TECHS = ['Klaus Braun', 'Luca Ferreira', 'Mia Hoffmann', 'Rui Santos', 'David Klein'];

const STATUS_LABELS: Record<string, string> = {
  installation: 'En installation',
  raccordement: 'Raccordement',
  visit: 'Visite terrain',
};

const STATUS_COLOR: Record<string, string> = {
  installation: 'bg-amber-100 text-amber-800 border-amber-200',
  raccordement: 'bg-blue-100 text-blue-800 border-blue-200',
  visit: 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function WorkerPage() {
  const { projects } = useProjects();

  const activeStatuses = ['installation', 'raccordement', 'visit'];

  // For each tech, find their assigned project(s)
  const techAssignments = TECHS.map(tech => {
    const assigned = projects.filter(
      p => p.assignedTech === tech && activeStatuses.includes(p.status)
    );
    return { tech, assigned };
  });

  const unassigned = projects.filter(
    p => activeStatuses.includes(p.status) && !p.assignedTech
  );

  const totalOnField = techAssignments.filter(t => t.assigned.length > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <HardHat className="h-7 w-7 text-slate-600" />
          <h1 className="text-3xl font-bold text-slate-900">Équipe terrain</h1>
        </div>
        <p className="text-slate-500">Vue d'ensemble des techniciens sur chantier aujourd'hui.</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HardHat className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalOnField}</p>
              <p className="text-xs text-slate-500">Sur chantier</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {projects.filter(p => p.status === 'installation').length}
              </p>
              <p className="text-xs text-slate-500">En installation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {projects.filter(p => p.status === 'raccordement').length}
              </p>
              <p className="text-xs text-slate-500">Raccordement</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{unassigned.length}</p>
              <p className="text-xs text-slate-500">Non assignés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tech grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {techAssignments.map(({ tech, assigned }) => {
          const initials = tech.split(' ').map(n => n[0]).join('');
          const isOnField = assigned.length > 0;
          return (
            <Card key={tech} className={`bg-white/80 backdrop-blur-sm border transition-shadow ${isOnField ? 'border-slate-200 shadow-md' : 'border-slate-100 opacity-70'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    isOnField
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{tech}</p>
                    <p className={`text-xs font-medium ${isOnField ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isOnField ? `${assigned.length} chantier${assigned.length > 1 ? 's' : ''} actif${assigned.length > 1 ? 's' : ''}` : 'Disponible / Bureau'}
                    </p>
                  </div>
                  <div className={`h-2.5 w-2.5 rounded-full ${isOnField ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
              </CardHeader>

              {assigned.length > 0 && (
                <CardContent className="space-y-3 pt-0">
                  {assigned.map(project => (
                    <div key={project.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{project.clientName}</p>
                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{project.address}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs shrink-0 ${STATUS_COLOR[project.status] ?? ''}`}>
                          {STATUS_LABELS[project.status] ?? project.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />{project.kwp} kWp
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{project.daysInStage}j sur site
                        </span>
                        <span className="ml-auto font-medium text-emerald-700">{formatCurrency(project.value)}</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                            Voir projet
                          </Button>
                        </Link>
                        {project.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => window.open(`tel:${project.phone}`)}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Unassigned projects */}
      {unassigned.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Projets actifs sans technicien assigné
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {unassigned.map(project => (
              <Card key={project.id} className="border-red-100 bg-red-50/30">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{project.clientName}</p>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{project.address}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${STATUS_COLOR[project.status] ?? ''}`}>
                      {STATUS_LABELS[project.status] ?? project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" />{project.kwp} kWp</span>
                    <span className="ml-auto font-medium text-emerald-700">{formatCurrency(project.value)}</span>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-1">
                      Assigner un technicien
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
