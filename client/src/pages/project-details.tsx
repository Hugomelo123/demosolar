import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useProjects } from '@/components/Providers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpBadges } from '@/components/FollowUpBadges';
import { NextActionCard } from '@/components/NextActionCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Phone, MapPin, User, MessageSquare } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import NotFound from './not-found';
import { Label } from '@/components/ui/label';

export default function ProjectDetails() {
  const [match, params] = useRoute('/projects/:id');
  const { projects, addNote, updateProject } = useProjects();
  const [noteText, setNoteText] = useState('');
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [tech, setTech] = useState('');

  if (!match || !params) return <NotFound />;

  const project = projects.find(p => p.id === params.id);
  if (!project) return <NotFound />;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(project.id, noteText);
    setNoteText('');
  };

  const handleSchedule = () => {
    updateProject(project.id, { visitDate, assignedTech: tech });
    setVisitOpen(false);
  };

  const steps = ['lead', 'visit', 'quote', 'creos', 'installation', 'completed'];
  const currentStepIndex = steps.indexOf(project.status);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-slate-900">{project.clientName}</h1>
            <Badge variant="outline" className="text-base px-3 py-1 bg-white border-slate-300 capitalize">
                {project.status}
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground gap-2">
            <MapPin className="h-4 w-4" />
            {project.address}
          </div>
          <FollowUpBadges project={project} />
        </div>
        <div className="text-right">
             <p className="text-2xl font-bold text-emerald-600">{formatCurrency(project.value)}</p>
             <p className="text-sm text-slate-500">{project.kwp} kWp System</p>
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto py-6">
        {/* Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10" />
        <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transition-all duration-500" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
                <div key={step} className="flex flex-col items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-xl">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${isCompleted ? 'bg-primary text-primary-foreground scale-110' : 'bg-slate-200 text-slate-500'}
                        ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                    `}>
                        {index + 1}
                    </div>
                    <span className={`text-xs font-medium uppercase ${isCurrent ? 'text-primary font-bold' : 'text-slate-500'}`}>
                        {step}
                    </span>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <NextActionCard project={project} />

            <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-slate-500" /> Notes & Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {project.notes.map((note, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                                {note}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Textarea 
                            placeholder="Add a note..." 
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            className="min-h-[80px]"
                        />
                        <Button onClick={handleAddNote} className="h-auto self-end">Add</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start gap-2 h-12">
                                <CalendarIcon className="h-4 w-4" /> Schedule Site Visit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule Site Visit</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <Input 
                                        type="datetime-local" 
                                        value={visitDate} 
                                        onChange={e => setVisitDate(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Technician</Label>
                                    <Select value={tech} onValueChange={setTech}>
                                        <SelectTrigger><SelectValue placeholder="Select technician" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Marc Weber">Marc Weber</SelectItem>
                                            <SelectItem value="Jean Dupont">Jean Dupont</SelectItem>
                                            <SelectItem value="Sarah Klein">Sarah Klein</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSchedule}>Confirm Booking</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full justify-start gap-2 h-12" onClick={() => window.open(`tel:${project.phone}`)}>
                        <Phone className="h-4 w-4" /> Call Client ({project.phone})
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 border-emerald-100">
                <CardHeader>
                    <CardTitle className="text-lg text-emerald-800">WhatsApp Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 h-auto py-3 text-left whitespace-normal"
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Bonjour ${project.clientName}, suite à notre devis pour le ${project.address}, avez-vous des questions? Cordialement, SolarOps.`)}`, '_blank')}
                    >
                        <span className="font-bold mr-2">Follow-up:</span> Quote sent check-in
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 h-auto py-3 text-left whitespace-normal"
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Bonjour ${project.clientName}, bonne nouvelle! Votre dossier CREOS est en cours de traitement. On revient vers vous sous 3 semaines.`)}`, '_blank')}
                    >
                        <span className="font-bold mr-2">Update:</span> CREOS Pending
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 h-auto py-3 text-left whitespace-normal"
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Bonjour ${project.clientName}, notre équipe passera le ${formatDate(new Date())} pour l'installation. Merci de libérer l'accès garage.`)}`, '_blank')}
                    >
                        <span className="font-bold mr-2">Install:</span> Schedule Confirmation
                    </Button>
                </CardContent>
            </Card>

            {project.visitDate && (
                 <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="p-4 flex items-center gap-3">
                        <User className="h-8 w-8 text-blue-500 bg-blue-100 rounded-full p-1" />
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase">Scheduled Visit</p>
                            <p className="font-bold text-blue-900">{formatDate(project.visitDate)}</p>
                            <p className="text-xs text-blue-700">Tech: {project.assignedTech}</p>
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
      </div>
    </div>
  );
}
