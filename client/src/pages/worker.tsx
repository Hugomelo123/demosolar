import React, { useState } from 'react';
import { Link } from 'wouter';
import { useProjects } from '@/components/Providers';
import { Sun, MapPin, Zap, CheckCircle2, AlertTriangle, Camera, ChevronRight, Phone, ArrowLeft, HardHat, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const CURRENT_TECH = 'Luca Ferreira';

interface ProblemReport {
  projectId: string;
  text: string;
}

export default function WorkerPage() {
  const { projects, addHistoryEvent, moveProject } = useProjects();
  const [problemOpen, setProblemOpen] = useState<string | null>(null);
  const [problemText, setProblemText] = useState('');
  const [photoOpen, setPhotoOpen] = useState<string | null>(null);
  const [photoNote, setPhotoNote] = useState('');

  const myProjects = projects.filter(
    p => (p.status === 'installation' || p.status === 'raccordement') && p.assignedTech === CURRENT_TECH
  );

  const pendingCount = myProjects.filter(p => p.status === 'installation').length;

  function handleProblem(projectId: string) {
    if (!problemText.trim()) return;
    addHistoryEvent(projectId, {
      type: 'problem',
      label: `Problema reportado: ${problemText.slice(0, 60)}`,
      meta: problemText,
    });
    toast.error('Problema reportado ao escritório', { description: problemText.slice(0, 80) });
    setProblemOpen(null);
    setProblemText('');
  }

  function handlePhoto(projectId: string) {
    if (!photoNote.trim()) return;
    addHistoryEvent(projectId, {
      type: 'field_update',
      label: `Foto + nota de terreno: ${photoNote.slice(0, 60)}`,
      meta: photoNote,
    });
    toast.success('Nota enviada ao escritório');
    setPhotoOpen(null);
    setPhotoNote('');
  }

  function handleDone(projectId: string) {
    moveProject(projectId, 'raccordement');
    addHistoryEvent(projectId, {
      type: 'status_change',
      label: 'Instalação concluída pelo técnico de terreno',
    });
    toast.success('Obra marcada como concluída!', { description: 'O escritório foi notificado.' });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 pt-8 pb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="flex items-center gap-1 text-emerald-200 text-sm">
            <ArrowLeft className="h-4 w-4" /> Escritório
          </Link>
          <div className="h-8 w-8 bg-emerald-800/50 rounded-full flex items-center justify-center text-xs font-bold">LF</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <HardHat className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-emerald-200 text-xs font-medium uppercase tracking-wide">Vista Terreno</p>
            <h1 className="text-2xl font-bold">{CURRENT_TECH}</h1>
            <p className="text-emerald-200 text-sm">
              {pendingCount > 0
                ? `${pendingCount} obra${pendingCount > 1 ? 's' : ''} hoje`
                : 'Sem obras pendentes hoje'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {myProjects.length === 0 ? (
          <div className="mt-16 text-center space-y-3">
            <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-500 opacity-60" />
            <p className="text-slate-400 text-lg font-medium">Nenhuma obra atribuída</p>
            <p className="text-slate-500 text-sm">Contacta o escritório para confirmação.</p>
          </div>
        ) : (
          myProjects.map(project => (
            <div key={project.id} className="bg-slate-800 rounded-2xl overflow-hidden">
              {/* Project header */}
              <div className="px-5 py-4 border-b border-slate-700">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold truncate">{project.clientName}</h2>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{project.address}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Zap className="h-4 w-4" />
                      {project.kwp} kWp
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(project.value)}</p>
                  </div>
                </div>

                {project.status === 'raccordement' && (
                  <div className="mt-3 flex items-center gap-2 bg-emerald-900/40 text-emerald-400 text-xs font-medium px-3 py-2 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Instalação concluída — aguarda raccordement CREOS
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {project.status === 'installation' && (
                <div className="p-4 grid grid-cols-1 gap-3">
                  {/* Report problem */}
                  <button
                    onClick={() => { setProblemOpen(project.id); setProblemText(''); }}
                    className="flex items-center gap-3 bg-red-900/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 rounded-xl px-5 py-4 font-bold text-base transition-colors active:scale-95"
                  >
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    Reportar problema
                    <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                  </button>

                  {/* Photo/note */}
                  <button
                    onClick={() => { setPhotoOpen(project.id); setPhotoNote(''); }}
                    className="flex items-center gap-3 bg-blue-900/40 border border-blue-800/60 hover:bg-blue-900/60 text-blue-300 rounded-xl px-5 py-4 font-bold text-base transition-colors active:scale-95"
                  >
                    <Camera className="h-6 w-6 shrink-0" />
                    Foto + nota
                    <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                  </button>

                  {/* Call client */}
                  {project.phone && (
                    <button
                      onClick={() => window.open(`tel:${project.phone}`)}
                      className="flex items-center gap-3 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200 rounded-xl px-5 py-4 font-bold text-base transition-colors active:scale-95"
                    >
                      <Phone className="h-6 w-6 shrink-0" />
                      Ligar ao cliente
                      <span className="ml-auto text-sm font-normal text-slate-400">{project.phone}</span>
                    </button>
                  )}

                  {/* Done */}
                  <button
                    onClick={() => handleDone(project.id)}
                    className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl px-5 py-5 font-bold text-lg transition-colors active:scale-95 mt-1 shadow-lg shadow-emerald-900/40"
                  >
                    <CheckCircle2 className="h-7 w-7" />
                    OBRA TERMINADA
                  </button>
                </div>
              )}

              {project.status === 'raccordement' && (
                <div className="p-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-3 bg-slate-700 rounded-xl px-5 py-4 text-slate-300 hover:bg-slate-600 transition-colors"
                  >
                    Ver detalhes do projeto
                    <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
                  </Link>
                </div>
              )}
            </div>
          ))
        )}

        {/* Demo note */}
        <div className="bg-amber-900/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-300 text-xs text-center">
          Vista de terreno — dados em tempo real do pipeline. A mostrar obras atribuídas a <strong>{CURRENT_TECH}</strong>.
        </div>
      </div>

      {/* Problem modal */}
      {problemOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="w-full bg-slate-800 rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Reportar problema
              </h3>
              <button onClick={() => setProblemOpen(null)} className="text-slate-400"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Material em falta', 'CREOS bloqueado', 'Acesso impedido', 'Problema estrutural', 'Telhado danificado', 'Outro'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setProblemText(opt)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium border transition-colors ${
                    problemText === opt
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              value={problemText}
              onChange={e => setProblemText(e.target.value)}
              placeholder="Descreve o problema em detalhe..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => handleProblem(problemOpen)}
              disabled={!problemText.trim()}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold py-4 rounded-xl text-base transition-colors"
            >
              Enviar ao escritório
            </button>
          </div>
        </div>
      )}

      {/* Photo/note modal */}
      {photoOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="w-full bg-slate-800 rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                <Camera className="h-5 w-5" /> Foto + nota
              </h3>
              <button onClick={() => setPhotoOpen(null)} className="text-slate-400"><X className="h-5 w-5" /></button>
            </div>
            {/* Mock camera area */}
            <div className="bg-slate-700 rounded-2xl h-40 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors"
              onClick={() => toast.info('Câmera (demo)', { description: 'Em produção abre a câmera nativa.' })}
            >
              <Camera className="h-10 w-10 text-slate-400" />
              <span className="text-slate-400 text-sm">Toca para tirar foto (demo)</span>
            </div>
            <textarea
              value={photoNote}
              onChange={e => setPhotoNote(e.target.value)}
              placeholder="Adiciona uma nota para o escritório..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handlePhoto(photoOpen)}
              disabled={!photoNote.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold py-4 rounded-xl text-base transition-colors"
            >
              Enviar ao escritório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
