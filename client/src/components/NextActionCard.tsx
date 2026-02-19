import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Project, NextAction, ProjectStatus } from "@/types";
import { useProjects } from "./Providers";
import { ArrowRight, Phone, CheckCircle, Calendar, FileText } from "lucide-react";
import { useLocation } from "wouter";

interface NextActionCardProps {
  project: Project;
}

export function NextActionCard({ project }: NextActionCardProps) {
  const { markContacted, moveProject, setNextAction } = useProjects();
  const [, setLocation] = useLocation();

  const handleAdvance = () => {
    const stages: ProjectStatus[] = ['lead', 'visit', 'quote', 'creos', 'installation', 'completed'];
    const currentIndex = stages.indexOf(project.status);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      moveProject(project.id, nextStage);
      
      // Auto-set reasonable next action based on new stage
      const nextActions: Record<string, NextAction> = {
        'visit': 'Schedule site visit',
        'quote': 'Send quote PDF',
        'creos': 'Send CREOS documents',
        'installation': 'Plan installation date',
        'completed': 'Close project'
      };
      if (nextActions[nextStage]) {
         setNextAction(project.id, nextActions[nextStage]);
      }
    }
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-xl bg-gradient-to-r from-white to-blue-50/50">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-1">Recommended Next Action</p>
                <CardTitle className="text-2xl text-primary">{project.nextAction}</CardTitle>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ArrowRight className="h-6 w-6" />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
            Current Stage: <span className="font-bold text-foreground capitalize">{project.status}</span> • Days in stage: {project.daysInStage}
        </p>
      </CardContent>
      <CardFooter className="gap-3 flex-wrap">
        <Button onClick={() => markContacted(project.id)} variant="outline" className="gap-2">
            <Phone className="h-4 w-4" /> Mark Contacted
        </Button>
        
        {project.status === 'installation' ? (
             <Button className="gap-2" onClick={() => setLocation(`/install/${project.id}`)}>
                <CheckCircle className="h-4 w-4" /> Open Install Checklist
             </Button>
        ) : (
            <Button onClick={handleAdvance} className="gap-2 bg-primary hover:bg-primary/90">
                Advance Stage <ArrowRight className="h-4 w-4" />
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
