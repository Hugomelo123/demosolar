import React from 'react';
import { Link } from 'wouter';
import {
  Sun, ArrowRight, Kanban, FileText, Bell, BarChart2,
  CheckSquare, Zap, Github, Linkedin, Mail, Wallet, Euro
} from 'lucide-react';

const features = [
  {
    icon: <Kanban className="h-4 w-4" />,
    title: 'Pipeline Kanban — 7 étapes',
    desc: 'De la prospection à la mise en service. Glisser-déposer avec annulation instantanée.',
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: 'Devis + KlimaBonus 2026',
    desc: 'Calcul automatique subvention (max €10,000 à 15 kWc), fourchette indicative, génération PDF client.',
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
    icon: <Wallet className="h-4 w-4" />,
    title: 'Préfinancement direct 2026',
    desc: 'Depuis le 4 janvier 2026, la subvention est déduite directement de la facture installateur.',
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

const stats = [
  { value: '€10 000', label: 'KlimaBonus max 2026', sub: 'à 15 kWc' },
  { value: '3%', label: 'TVA réduite', sub: 'toutes installations PV' },
  { value: '15 ans', label: 'Tarif injection garanti', sub: '0,1374 €/kWh — CREOS' },
  { value: '6–12 ans', label: 'Payback estimé', sub: 'après aides + communes' },
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
              Gestion de chantiers · Luxembourg
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hidden sm:block">
          Demo · Données fictives
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10 md:py-16">
        {/* Hero */}
        <div className="max-w-3xl w-full mx-auto text-center">
          {/* Domain badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            CREOS · KlimaBonus 2026 · Préfinancement direct · Luxembourg
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
            au raccordement CREOS, avec suivi KlimaBonus 2026 et alertes opérationnelles intégrées.
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

        {/* Stats bar — KlimaBonus 2026 data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-14 max-w-4xl w-full mx-auto">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600 leading-tight">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-4xl w-full mx-auto">
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

        {/* About the builder */}
        <div className="mt-16 max-w-4xl w-full mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar placeholder */}
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-2xl font-bold shadow-lg flex-shrink-0">
                HM
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">Hugo Melo</h2>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    Candidat Coordination Opérationnelle · Luxembourg
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Ce demo a été construit pour démontrer ma capacité à analyser un processus métier,
                  identifier les points de friction, et livrer une solution digitale fonctionnelle —
                  avec des données réelles (CREOS, KlimaBonus, marchés luxembourgeois).
                  Le secteur solaire est le contexte ; la compétence est transférable.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/Hugomelo123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hugomelo1297"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                  <a
                    href="mailto:hugo1297@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/20 text-emerald-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    hugo1297@gmail.com
                  </a>
                </div>
              </div>
              {/* Skills tags */}
              <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                {['Analyse terrain', 'Outils digitaux', 'Marché Luxembourg', 'Résolution de problèmes'].map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-md text-center"
                    dangerouslySetInnerHTML={{ __html: tag }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-100 mt-8">
        Demo construit en 1 jour · Données fictives · Pas un produit commercial
        <span className="mx-2">·</span>
        KlimaBonus 2026 — données Klima-Agence &amp; guichet.lu · Mars 2026
      </footer>
    </div>
  );
}
