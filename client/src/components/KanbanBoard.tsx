import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Project, ProjectStatus } from '@/types';
import { useProjects } from './Providers';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FollowUpBadges } from './FollowUpBadges';
import { formatCurrency } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'wouter';

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'lead', title: 'Lead', color: 'bg-slate-100' },
  { id: 'visit', title: 'Visite planifiée', color: 'bg-blue-50' },
  { id: 'quote', title: 'Devis envoyé', color: 'bg-amber-50' },
  { id: 'creos', title: 'CREOS en attente', color: 'bg-purple-50' },
  { id: 'installation', title: 'Installation', color: 'bg-emerald-50' },
  { id: 'completed', title: 'Terminé', color: 'bg-slate-200' },
];

function DraggableProjectCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
    data: { project },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`mb-3 touch-none ${isDragging ? 'opacity-50 z-50' : ''}`}>
      <Link href={`/projects/${project.id}`}>
        <Card className="cursor-pointer hover:shadow-md transition-all active:cursor-grabbing border-l-4 border-l-primary/50">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{project.clientName}</h4>
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 border-slate-200 bg-slate-50">
                {project.daysInStage}d
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2 truncate">{project.address}</p>
            <div className="flex justify-between items-center text-xs font-medium text-slate-700">
              <span>{project.kwp} kWp</span>
              <span>{formatCurrency(project.value)}</span>
            </div>
            <FollowUpBadges project={project} />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function DroppableColumn({ column, projects }: { column: typeof COLUMNS[0], projects: Project[] }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[280px] rounded-xl p-2 ${column.color} border border-white/50 backdrop-blur-sm shadow-inner`}>
      <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-3 px-2 flex justify-between">
        {column.title}
        <span className="bg-white/50 px-2 rounded-full text-slate-400">{projects.length}</span>
      </h3>
      <div className="flex flex-col gap-2 min-h-[500px]">
        {projects.map(project => (
          <DraggableProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { projects, moveProject } = useProjects();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const projectId = active.id as string;
      const newStatus = over.id as ProjectStatus;
      
      // Only move if status is valid
      if (COLUMNS.some(c => c.id === newStatus)) {
        moveProject(projectId, newStatus);
      }
    }
    setActiveId(null);
  };

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-8 pt-2 px-2 snap-x">
        {COLUMNS.map(column => (
          <DroppableColumn 
            key={column.id} 
            column={column} 
            projects={projects.filter(p => p.status === column.id)} 
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject ? (
           <Card className="cursor-grabbing shadow-2xl rotate-3 scale-105 border-l-4 border-l-primary bg-white opacity-90 w-[280px]">
             <CardContent className="p-3">
               <h4 className="font-bold text-sm">{activeProject.clientName}</h4>
               <p className="text-xs text-muted-foreground">{activeProject.address}</p>
             </CardContent>
           </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
