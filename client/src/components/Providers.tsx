import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Project, ProjectStatus, NextAction, ChangeEvent } from '../types';
import { initialProjects } from '../lib/mockData';

function makeEvent(type: ChangeEvent['type'], label: string, meta?: string): ChangeEvent {
  return { id: crypto.randomUUID(), type, label, at: new Date().toISOString(), meta };
}

export interface AddProjectData {
  clientName: string;
  address: string;
  kwp: number;
  value: number;
  phone?: string;
  notes?: string[];
  owner?: 'Sales' | 'Admin' | 'Team';
  dueDate?: string;
}

interface ProjectsContextType {
  projects: Project[];
  updateProject: (id: string, patch: Partial<Project>) => void;
  moveProject: (id: string, status: ProjectStatus) => void;
  addProject: (data: AddProjectData) => Project;
  addNote: (id: string, note: string) => void;
  markContacted: (id: string) => void;
  setNextAction: (id: string, nextAction: NextAction) => void;
  addHistoryEvent: (id: string, event: Omit<ChangeEvent, 'id' | 'at'>) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount — v2 adds stageEnteredAt/lastContactAt
  useEffect(() => {
    const version = localStorage.getItem('solarops_version');
    if (version !== '3') {
      // v3 adds assignedTech to installation/raccordement mock projects
      localStorage.removeItem('solarops_projects');
      localStorage.setItem('solarops_version', '3');
      return;
    }
    const saved = localStorage.getItem('solarops_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        setProjects(parsed);
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  // Debounced save to localStorage (300ms) — avoids blocking on every keystroke/drag
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem('solarops_projects', JSON.stringify(projects));
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [projects]);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  }, []);

  const moveProject = useCallback((id: string, status: ProjectStatus) => {
    const stageLabels: Record<string, string> = {
      lead: 'Prospection', visit: 'Visite technique', quote: 'Devis',
      creos: 'Autorisation CREOS', installation: 'Installation',
      raccordement: 'Raccordement', completed: 'Terminé',
    };
    const ev = makeEvent('status_change', `Avancé vers ${stageLabels[status] ?? status}`);
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, status, daysInStage: 0, stageEnteredAt: new Date().toISOString(), history: [...(p.history ?? []), ev] }
        : p
    ));
  }, []);

  const addProject = useCallback((data: AddProjectData): Project => {
    const id = crypto.randomUUID();
    const newProject: Project = {
      id,
      clientName: data.clientName,
      address: data.address,
      kwp: data.kwp,
      value: data.value,
      status: 'quote',
      createdAt: new Date(),
      daysInStage: 0,
      lastContactDaysAgo: 0,
      phone: data.phone ?? '',
      nextAction: 'Send quote PDF',
      notes: data.notes ?? [],
      owner: data.owner ?? 'Sales',
      dueDate: data.dueDate,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const addNote = useCallback((id: string, note: string) => {
    const ev = makeEvent('note', `Note ajoutée`, note.slice(0, 80));
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, notes: [...p.notes, note], history: [...(p.history ?? []), ev] } : p
    ));
  }, []);

  const markContacted = useCallback((id: string) => {
    const ev = makeEvent('contact', 'Contact client enregistré');
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, lastContactDaysAgo: 0, lastContactAt: new Date().toISOString(), history: [...(p.history ?? []), ev] }
        : p
    ));
  }, []);

  const addHistoryEvent = useCallback((id: string, event: Omit<ChangeEvent, 'id' | 'at'>) => {
    const ev: ChangeEvent = { ...event, id: crypto.randomUUID(), at: new Date().toISOString() };
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, history: [...(p.history ?? []), ev] } : p
    ));
  }, []);

  const setNextAction = useCallback((id: string, nextAction: NextAction) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, nextAction } : p
    ));
  }, []);

  const value = useMemo(() => ({
    projects,
    updateProject,
    moveProject,
    addProject,
    addNote,
    markContacted,
    setNextAction,
    addHistoryEvent,
  }), [projects, updateProject, moveProject, addProject, addNote, markContacted, setNextAction, addHistoryEvent]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
