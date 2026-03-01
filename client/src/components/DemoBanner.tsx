import React, { useState } from 'react';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between gap-4">
      <span>
        <span className="text-slate-500 mr-2">Demo ·</span>
        Données fictives basées sur le marché solaire luxembourgeois
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-500 hover:text-slate-200 transition-colors flex-shrink-0 text-base leading-none"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}
