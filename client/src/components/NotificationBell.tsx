import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, PhoneOff, X } from 'lucide-react';
import { Link } from 'wouter';
import { useProjects } from './Providers';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'creos' | 'quote' | 'contact';
  projectId: string;
  clientName: string;
  label: string;
  days: number;
}

export function NotificationBell() {
  const { projects } = useProjects();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const alerts: Alert[] = [];

  for (const p of projects) {
    if (p.status === 'completed') continue;
    if (p.status === 'creos' && p.daysInStage > 21) {
      alerts.push({ id: p.id + '-creos', type: 'creos', projectId: p.id, clientName: p.clientName, label: 'CREOS bloqué', days: p.daysInStage });
    }
    if (p.status === 'quote' && p.daysInStage > 14) {
      alerts.push({ id: p.id + '-quote', type: 'quote', projectId: p.id, clientName: p.clientName, label: 'Devis sans réponse', days: p.daysInStage });
    }
    if (p.lastContactDaysAgo > 7) {
      alerts.push({ id: p.id + '-contact', type: 'contact', projectId: p.id, clientName: p.clientName, label: 'Sans contact', days: p.lastContactDaysAgo });
    }
  }

  alerts.sort((a, b) => b.days - a.days);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const iconMap = {
    creos: <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />,
    quote: <Clock className="h-4 w-4 text-amber-500 shrink-0" />,
    contact: <PhoneOff className="h-4 w-4 text-blue-500 shrink-0" />,
  };

  const colorMap = {
    creos: 'border-l-red-400 bg-red-50/60',
    quote: 'border-l-amber-400 bg-amber-50/60',
    contact: 'border-l-blue-400 bg-blue-50/60',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'relative h-9 w-9 flex items-center justify-center rounded-lg transition-colors',
          open ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        )}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {alerts.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center leading-none">
            {alerts.length > 9 ? '9+' : alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 rounded-xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-700">
              Alertes {alerts.length > 0 && <span className="ml-1 text-red-500">({alerts.length})</span>}
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Aucune alerte active
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {alerts.map(alert => (
                <Link
                  key={alert.id}
                  href={`/projects/${alert.projectId}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 border-l-4 hover:brightness-95 transition-all cursor-pointer',
                    colorMap[alert.type]
                  )}
                >
                  {iconMap[alert.type]}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 truncate">{alert.clientName}</p>
                    <p className="text-xs text-slate-500">{alert.label} · {alert.days}j</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {alerts.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
              <Link href="/analytics" onClick={() => setOpen(false)} className="text-xs text-primary font-medium hover:underline">
                Voir l'analyse complète →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
