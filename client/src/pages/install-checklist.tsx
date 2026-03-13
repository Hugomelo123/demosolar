import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { useProjects } from '@/components/Providers';
import { ChecklistSection } from '@/components/ChecklistSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User } from 'lucide-react';
import NotFound from './not-found';
import { formatDate } from '@/lib/utils';
import { opsCopy } from '@/config/opsCopy';

export default function InstallChecklistPage() {
  const [match, params] = useRoute('/install/:id');
  const { projects, moveProject } = useProjects();
  const [, navigate] = useLocation();

  if (!match || !params) return <NotFound />;

  const project = projects.find(p => p.id === params.id);
  if (!project) return <NotFound />;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <Badge className="mb-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">{opsCopy.installPhase}</Badge>
        <h1 className="text-3xl font-bold text-slate-900">{opsCopy.installChecklistTitle}</h1>
        <p className="text-muted-foreground">{opsCopy.installManageFor} {project.clientName}</p>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 className="font-bold text-lg">{project.clientName}</h3>
                <div className="flex items-center text-sm text-slate-500 gap-2 mt-1">
                    <MapPin className="h-4 w-4" /> {project.address}
                </div>
            </div>
            <div className="flex gap-6 text-sm">
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{opsCopy.quoteSystemSize}</span>
                    <span className="font-bold">{project.kwp} kWp</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{opsCopy.visitDate}</span>
                    <span className="font-bold flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {project.visitDate ? formatDate(project.visitDate) : opsCopy.notSet}
                    </span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{opsCopy.techLead}</span>
                    <span className="font-bold flex items-center gap-1">
                        <User className="h-3 w-3" /> {project.assignedTech || opsCopy.unassigned}
                    </span>
                </div>
            </div>
        </CardContent>
      </Card>

      <ChecklistSection
        projectId={project.id}
        onComplete={() => {
          moveProject(project.id, 'raccordement');
          navigate(`/projects/${project.id}`);
        }}
      />
    </div>
  );
}
