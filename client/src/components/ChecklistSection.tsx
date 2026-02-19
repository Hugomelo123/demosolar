import React, { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { opsCopy } from '@/config/opsCopy';

const STORAGE_KEY = 'solarops_checklist';

type SectionKey = 'preInstall' | 'dayOf' | 'postInstall';
type SectionItem = { id: string; label: string; checked: boolean };
type SectionsState = Record<SectionKey, SectionItem[]>;

function getDefaultSections(): SectionsState {
  return {
    preInstall: [
      { id: 'permits', label: opsCopy.checklistPermits, checked: true },
      { id: 'creos_grid', label: opsCopy.checklistCreos, checked: true },
      { id: 'deposit', label: opsCopy.checklistDeposit, checked: true },
      { id: 'materials', label: opsCopy.checklistMaterials, checked: false },
      { id: 'team', label: opsCopy.checklistTeam, checked: false },
    ],
    dayOf: [
      { id: 'safety', label: opsCopy.checklistSafety, checked: false },
      { id: 'roof', label: opsCopy.checklistRoof, checked: false },
      { id: 'mounting', label: opsCopy.checklistMounting, checked: false },
      { id: 'panels', label: opsCopy.checklistPanels, checked: false },
      { id: 'inverter', label: opsCopy.checklistInverter, checked: false },
      { id: 'electrical', label: opsCopy.checklistElectrical, checked: false },
    ],
    postInstall: [
      { id: 'testing', label: opsCopy.checklistTesting, checked: false },
      { id: 'cleanup', label: opsCopy.checklistCleanup, checked: false },
      { id: 'walkthrough', label: opsCopy.checklistWalkthrough, checked: false },
      { id: 'docs', label: opsCopy.checklistDocs, checked: false },
      { id: 'photos', label: opsCopy.checklistPhotos, checked: false },
    ],
  };
}

/** Persisted: only id + checked per section (no labels). */
type PersistedState = Record<SectionKey, { id: string; checked: boolean }[]>;

function loadPersisted(projectId: string): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: Record<string, PersistedState> = JSON.parse(raw);
    return data[projectId] ?? null;
  } catch {
    return null;
  }
}

function savePersisted(projectId: string, sections: SectionsState) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, PersistedState> = raw ? JSON.parse(raw) : {};
    data[projectId] = {
      preInstall: sections.preInstall.map(({ id, checked }) => ({ id, checked })),
      dayOf: sections.dayOf.map(({ id, checked }) => ({ id, checked })),
      postInstall: sections.postInstall.map(({ id, checked }) => ({ id, checked })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save checklist', e);
  }
}

function mergeWithPersisted(defaultSections: SectionsState, persisted: PersistedState | null): SectionsState {
  if (!persisted) return defaultSections;
  const result = { ...defaultSections };
  (['preInstall', 'dayOf', 'postInstall'] as const).forEach(section => {
    const byId = Object.fromEntries((persisted[section] ?? []).map(p => [p.id, p.checked]));
    result[section] = defaultSections[section].map(item => ({
      ...item,
      checked: byId[item.id] ?? item.checked,
    }));
  });
  return result;
}

function SimpleCheckbox({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (c: boolean) => void; label: string }) {
  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
      onClick={() => onCheckedChange(!checked)}
    >
      <div className={cn(
        "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
      )}>
        {checked && <CheckCircle2 className="h-4 w-4" />}
      </div>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}

interface ChecklistSectionProps {
  projectId: string;
}

export function ChecklistSection({ projectId }: ChecklistSectionProps) {
  const defaultSections = getDefaultSections();
  const [sections, setSections] = useState<SectionsState>(() =>
    mergeWithPersisted(defaultSections, loadPersisted(projectId))
  );
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSections(mergeWithPersisted(getDefaultSections(), loadPersisted(projectId)));
  }, [projectId]);

  const toggle = (section: SectionKey, id: string) => {
    setSections(prev => {
      const next = {
        ...prev,
        [section]: prev[section].map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      };
      savePersisted(projectId, next);
      return next;
    });
  };

  const allItems = [...sections.preInstall, ...sections.dayOf, ...sections.postInstall];
  const checkedCount = allItems.filter(i => i.checked).length;
  const progress = Math.round((checkedCount / allItems.length) * 100);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-700">{opsCopy.installProgress}</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader><CardTitle className="text-lg text-blue-700">{opsCopy.preInstallTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {sections.preInstall.map(item => (
              <SimpleCheckbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle('preInstall', item.id)} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-400">
          <CardHeader><CardTitle className="text-lg text-amber-700">{opsCopy.dayOfTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {sections.dayOf.map(item => (
              <SimpleCheckbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle('dayOf', item.id)} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-400">
          <CardHeader><CardTitle className="text-lg text-emerald-700">{opsCopy.postInstallTitle}</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {sections.postInstall.map(item => (
              <SimpleCheckbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle('postInstall', item.id)} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button
          size="lg"
          className="w-full md:w-auto text-lg gap-2"
          disabled={progress < 100 || completed}
          onClick={handleComplete}
        >
          {completed ? `${opsCopy.installCompleted} 🎉` : opsCopy.completeInstallButton}
        </Button>
      </div>

      {completed && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="font-bold text-emerald-800">{opsCopy.installSuccessTitle}</AlertTitle>
          <AlertDescription>
            {opsCopy.installSuccessDesc}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
