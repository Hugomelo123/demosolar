import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

// Mock Checkbox since I didn't create ui/checkbox
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

export function ChecklistSection() {
    const [sections, setSections] = useState({
        preInstall: [
            { id: 'permits', label: 'Building permit received', checked: true },
            { id: 'creos_grid', label: 'CREOS grid connection approval', checked: true },
            { id: 'deposit', label: 'Client deposit received (30%)', checked: true },
            { id: 'materials', label: 'Materials delivered to warehouse', checked: false },
            { id: 'team', label: 'Installation team assigned', checked: false },
        ],
        dayOf: [
            { id: 'safety', label: 'Safety briefing & harness check', checked: false },
            { id: 'roof', label: 'Roof structure inspection', checked: false },
            { id: 'mounting', label: 'Mounting system installation', checked: false },
            { id: 'panels', label: 'Panel installation & cabling', checked: false },
            { id: 'inverter', label: 'Inverter & battery mounting', checked: false },
            { id: 'electrical', label: 'AC/DC connection', checked: false },
        ],
        postInstall: [
            { id: 'testing', label: 'System testing & commissioning', checked: false },
            { id: 'cleanup', label: 'Site cleanup & waste removal', checked: false },
            { id: 'walkthrough', label: 'Client walkthrough & app setup', checked: false },
            { id: 'docs', label: 'Final documentation handover', checked: false },
            { id: 'photos', label: 'Final installation photos uploaded', checked: false },
        ]
    });

    const [completed, setCompleted] = useState(false);

    const toggle = (section: keyof typeof sections, id: string) => {
        setSections(prev => ({
            ...prev,
            [section]: prev[section].map(item => 
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        }));
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
                        <span className="font-bold text-slate-700">Installation Progress</span>
                        <span className="font-bold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-l-4 border-l-blue-400">
                    <CardHeader><CardTitle className="text-lg text-blue-700">Pre-Installation</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        {sections.preInstall.map(item => (
                            <SimpleCheckbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle('preInstall', item.id)} />
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-400">
                    <CardHeader><CardTitle className="text-lg text-amber-700">Installation Day</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        {sections.dayOf.map(item => (
                            <SimpleCheckbox key={item.id} label={item.label} checked={item.checked} onCheckedChange={() => toggle('dayOf', item.id)} />
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-400">
                    <CardHeader><CardTitle className="text-lg text-emerald-700">Post-Installation</CardTitle></CardHeader>
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
                    {completed ? "Installation Completed 🎉" : "Complete Installation Project"}
                </Button>
            </div>

            {completed && (
                <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900 animate-in zoom-in-95 duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <AlertTitle className="font-bold text-emerald-800">Success!</AlertTitle>
                    <AlertDescription>
                        Project marked as completed. The client has been notified to schedule the final walkthrough.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
