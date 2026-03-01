import React from 'react';
import { Link } from 'wouter';
import { Sun, ArrowRight, Kanban, FileText, Bell, BarChart2, CheckSquare, Zap } from 'lucide-react';

const features = [
  {
    icon: <Kanban className="h-4 w-4" />,
    title: 'Pipeline Kanban — 7 étapes',
    desc: 'De la prospection à la mise en service. Glisser-déposer avec annulation instantanée.',
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: 'Devis + KlimaBonus 2026',
    desc: 'Calcul automatique de la subvention, fourchette indicative, génération PDF client.',
  },
  {
    icon: <Bell className="h-4 w-4" />,
    title: 'Alertes goulots d\'étranglement',
    desc: 'CREOS bloqué, devis sans réponse, relances en retard — identifiés automatiquement.',
  },
  {
    icon: <BarChart2 className="h-4 w-4" />,
    title: 'Analytics pipeline',
    desc: 'Valeur par étape, taux de conversion, durée moyenne de traitement CREOS.',
  },
  {
    icon: <CheckSquare className="h-4 w-4" />,
    title: 'Checklist d\'installation',
    desc: 'Pré-install, jour J, raccordement CREOS — suivi structuré par projet.',
  },
  {
    icon: <Zap className="h-4 w-4" />,
    title: 'Données marché luxembourgeois',
    desc: 'Communes, codes postaux L-, références CREOS, KlimaBonus — prix marché 2025.',
  },
];

const funnelSteps = [
  'Prospection',
  'Visite technique',
  'Devis + KlimaBonus',
  'Autorisation CREOS',
  'Installation',
  'Raccordement',
  'Terminé',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 flex flex-col font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sun className="h-6 w-6 fill-yellow-300 stroke-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 leading-tight block">
              SolarOps
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5 block">
              Console opérations · Luxembourg
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hidden sm:block">
          Demo · Données fictives
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 md:py-16">
        <div className="max-w-3xl w-full mx-auto text-center">
          {/* Domain badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            CREOS · KlimaBonus 2026 · Marché solaire luxembourgeois
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
            Gestion opérationnelle
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600">
              pour installateurs solaires
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Une console construite pour le processus luxembourgeois — de la prospection
            au raccordement CREOS, avec suivi KlimaBonus et alertes opérationnelles intégrées.
          </p>

          {/* Funnel visual */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 text-xs font-medium text-slate-500">
            {funnelSteps.map((step, i) => (
              <React.Fragment key={step}>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm text-slate-600">
                  {step}
                </span>
                {i < funnelSteps.length - 1 && (
                  <span className="text-slate-300 text-sm">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* CTA */}
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base group">
              Voir le demo
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-w-4xl w-full mx-auto">
          {features.map(f => (
            <div
              key={f.title}
              className="flex gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-8 w-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{f.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-100">
        Demo construit en 4 jours · Données fictives · Pas un produit commercial
      </footer>
    </div>
  );
}
