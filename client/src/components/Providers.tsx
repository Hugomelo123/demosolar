import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus, NextAction } from '../types';
import { initialProjects } from '../lib/mockData';
import { subDays } from 'date-fns';

interface ProjectsContextType {
  projects: Project[];
  updateProject: (id: string, patch: Partial<Project>) => void;
  moveProject: (id: string, status: ProjectStatus) => void;
  addNote: (id: string, note: string) => void;
  markContacted: (id: string) => void;
  setNextAction: (id: string, nextAction: NextAction) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Load from local storage on mount (optional for persistence across reloads in demo)
  useEffect(() => {
    const saved = localStorage.getItem('solarops_projects');
    if (saved) {
      try {
        // Need to parse dates back from JSON strings
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

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('solarops_projects', JSON.stringify(projects));
  }, [projects]);

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const moveProject = (id: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, status, daysInStage: 0 } : p
    ));
  };

  const addNote = (id: string, note: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, notes: [...p.notes, note] } : p
    ));
  };

  const markContacted = (id: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, lastContactDaysAgo: 0 } : p
    ));
  };

  const setNextAction = (id: string, nextAction: NextAction) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, nextAction } : p
    ));
  };

  return (
    <ProjectsContext.Provider value={{ projects, updateProject, moveProject, addNote, markContacted, setNextAction }}>
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
