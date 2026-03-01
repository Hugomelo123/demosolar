import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const handleReset = () => {
    localStorage.removeItem('solarops_projects');
    window.location.reload();
  };

  return (
    <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between gap-4">
      <span>
        <span className="text-slate-500 mr-2">Demo ·</span>
        Données fictives basées sur le marché solaire luxembourgeois
      </span>
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          title="Réinitialiser les données demo"
        >
          <RotateCcw className="h-3 w-3" />
          Réinitialiser
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-200 transition-colors text-base leading-none"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
