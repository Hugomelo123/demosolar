import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Project, NextAction, ProjectStatus } from "@/types";
import { useProjects } from "./Providers";
import { ArrowRight, Phone, CheckCircle, Calendar, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { opsCopy } from "@/config/opsCopy";

interface NextActionCardProps {
  project: Project;
}

export const nextActionToLabel: Record<NextAction, string> = {
  'Call client': 'Appeler le client',
  'Schedule site visit': 'Planifier visite',
  'Send quote PDF': 'Envoyer devis PDF',
  'Send CREOS documents': 'Envoyer dossier CREOS',
  'Request deposit': 'Demander acompte',
  'Plan installation date': 'Planifier date installation',
  'Schedule CREOS raccordement': 'Planifier raccordement CREOS',
  'Close project': 'Clôturer le projet',
};

export function NextActionCard({ project }: NextActionCardProps) {
  const { markContacted, moveProject, setNextAction } = useProjects();
  const [, setLocation] = useLocation();

  const handleAdvance = () => {
    const stages: ProjectStatus[] = ['lead', 'visit', 'quote', 'creos', 'installation', 'raccordement', 'completed'];
    const currentIndex = stages.indexOf(project.status);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      moveProject(project.id, nextStage);
      const nextActions: Record<string, NextAction> = {
        'visit': 'Schedule site visit',
        'quote': 'Send quote PDF',
        'creos': 'Send CREOS documents',
        'installation': 'Plan installation date',
        'raccordement': 'Schedule CREOS raccordement',
        'completed': 'Close project'
      };
      if (nextActions[nextStage]) {
         setNextAction(project.id, nextActions[nextStage]);
      }
    }
  };

  const nextActionLabel = nextActionToLabel[project.nextAction] ?? project.nextAction;

  return (
    <Card className="border-l-4 border-l-primary shadow-xl bg-gradient-to-r from-white to-blue-50/50">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-1">{opsCopy.nextActionLabel}</p>
                <CardTitle className="text-2xl text-primary">{nextActionLabel}</CardTitle>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ArrowRight className="h-6 w-6" />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
            {opsCopy.currentStage}: <span className="font-bold text-foreground">
              {({ lead: opsCopy.stepLead, visit: opsCopy.stepVisit, quote: opsCopy.stepQuote, creos: opsCopy.stepCreos, installation: opsCopy.stepInstallation, raccordement: opsCopy.stepRaccordement, completed: opsCopy.stepCompleted } as Record<string, string>)[project.status] ?? project.status}
            </span> • {opsCopy.daysInStage}: {project.daysInStage}
        </p>
      </CardContent>
      <CardFooter className="gap-3 flex-wrap">
        <Button onClick={() => markContacted(project.id)} variant="outline" className="gap-2">
            <Phone className="h-4 w-4" /> {opsCopy.markContacted}
        </Button>
        
        {project.status === 'installation' ? (
             <Button className="gap-2" onClick={() => setLocation(`/install/${project.id}`)}>
                <CheckCircle className="h-4 w-4" /> {opsCopy.openInstallChecklist}
             </Button>
        ) : (
            <Button onClick={handleAdvance} className="gap-2 bg-primary hover:bg-primary/90">
                {opsCopy.advanceStage} <ArrowRight className="h-4 w-4" />
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
