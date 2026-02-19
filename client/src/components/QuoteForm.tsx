import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { PriceListUpload } from './PriceListUpload';
import { QuoteData } from '@/types';
import { calculateKwp, calculateProduction, calculateKlimabonus, calculateCost, calculateAnnualSavings, calculatePayback, calculateNetCost, calculateNetCostRange } from '@/lib/calculations';
import { generateQuotePDF } from '@/lib/pdf';
import { FileText, Send, Zap, Sun, Wallet, Battery, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useProjects } from './Providers';
import { toast } from '@/hooks/use-toast';
import { opsCopy } from '@/config/opsCopy';

export function QuoteForm() {
  const [, setLocation] = useLocation();
  const { addProject } = useProjects();
  const [clientName, setClientName] = useState('');

  const [data, setData] = useState<QuoteData>({
    address: '123 Route d\'Arlon, Luxembourg',
    roofType: 'pitched',
    areaM2: 45,
    monthlyBill: 150,
    hasBattery: false,
    consumptionProfile: 'normal',
    packageType: 'basic',
    kwp: 0,
    production: 0,
    installCost: 0,
    klimabonus: 0,
    netCost: 0,
    netCostMin: 0,
    netCostMax: 0,
    annualSavings: 0,
    paybackYears: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Recalculate whenever inputs change (rules: lib/calculations.ts)
  useEffect(() => {
    const kwp = calculateKwp(data.areaM2);
    const production = calculateProduction(kwp);
    const installCost = calculateCost(kwp, data.packageType) + (data.hasBattery ? 6500 : 0); // battery add-on ~€6,500
    const klimabonus = calculateKlimabonus(kwp, data.hasBattery);
    const netCost = calculateNetCost(installCost, klimabonus); // never negative
    const { min: netCostMin, max: netCostMax, mid: netCostMid } = calculateNetCostRange(netCost);
    const annualSavings = calculateAnnualSavings(data.monthlyBill, data.consumptionProfile) + (data.hasBattery ? 200 : 0); // extra with battery
    const paybackYears = calculatePayback(netCostMid, annualSavings); // payback on midpoint of range

    setData(prev => ({
      ...prev,
      kwp,
      production,
      installCost,
      klimabonus,
      netCost,
      netCostMin,
      netCostMax,
      annualSavings,
      paybackYears,
    }));
  }, [data.areaM2, data.packageType, data.hasBattery, data.monthlyBill, data.consumptionProfile]);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateQuotePDF(data);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Devis_${new Date().toISOString().split('T')[0]}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'PDF généré', description: 'Le devis a été téléchargé.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('PDF Error', error);
      toast({ title: 'Erreur PDF', description: message || 'Impossible de générer le PDF.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsApp = () => {
    const rangeText = data.netCostMin === data.netCostMax ? `${data.netCostMin}€` : `entre ${data.netCostMin} et ${data.netCostMax} €`;
    const message = `Bonjour! Estimation pour ${data.address}: ${data.kwp} kWp, coût net indicatif ${rangeText}. Prochaine étape: visite technique?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToPipeline = () => {
    const addressTrimmed = data.address.trim();
    if (!addressTrimmed) {
      toast({ title: opsCopy.toastAddressRequired, description: opsCopy.toastAddressDesc, variant: 'destructive' });
      return;
    }
    if (data.kwp <= 0) {
      toast({ title: opsCopy.toastInvalidQuote, description: opsCopy.toastInvalidQuoteDesc, variant: 'destructive' });
      return;
    }
    const name = clientName.trim() || (addressTrimmed ? `Client - ${addressTrimmed.split(',')[0].trim()}` : opsCopy.newLeadDefault);
    const pipelineValue = data.netCostMin && data.netCostMax ? Math.round((data.netCostMin + data.netCostMax) / 2) : data.netCost;
    const project = addProject({
      clientName: name,
      address: addressTrimmed,
      kwp: data.kwp,
      value: pipelineValue,
      notes: [`${opsCopy.quoteNotePrefix}: ${data.kwp} kWp, ${data.packageType}, ${data.hasBattery ? opsCopy.withBattery : opsCopy.noBattery} (fourchette €${data.netCostMin}–€${data.netCostMax})`],
    });
    setLocation(`/projects/${project.id}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* LEFT COLUMN - INPUTS */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>{opsCopy.quoteProjectDetails}</CardTitle>
            <CardDescription>{opsCopy.quoteProjectDetailsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>{opsCopy.quoteClientName}</Label>
                <Input 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)} 
                    placeholder={opsCopy.quoteClientPlaceholder}
                />
            </div>
            <div className="space-y-2">
                <Label>{opsCopy.quoteFullAddress}</Label>
                <Input 
                    value={data.address} 
                    onChange={e => setData({...data, address: e.target.value})} 
                    placeholder={opsCopy.quoteAddressPlaceholder}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{opsCopy.quoteRoofType}</Label>
                    <Select value={data.roofType} onValueChange={(v: QuoteData['roofType']) => setData({...data, roofType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pitched">{opsCopy.quoteRoofPitched}</SelectItem>
                            <SelectItem value="flat">{opsCopy.quoteRoofFlat}</SelectItem>
                            <SelectItem value="facade">{opsCopy.quoteRoofFacade}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{opsCopy.quotePackage}</Label>
                    <Select value={data.packageType} onValueChange={(v: QuoteData['packageType']) => setData({...data, packageType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">{opsCopy.quotePackageBasic}</SelectItem>
                            <SelectItem value="premium">{opsCopy.quotePackagePremium}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <Label>{opsCopy.quoteRoofArea}</Label>
                    <span className="font-bold text-primary">{data.areaM2} m²</span>
                </div>
                <Slider 
                    value={[data.areaM2]} 
                    min={10} max={200} step={1} 
                    onValueChange={([v]) => setData({...data, areaM2: v})} 
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <Label>{opsCopy.quoteMonthlyBill}</Label>
                    <span className="font-bold text-primary">{data.monthlyBill} €</span>
                </div>
                <Slider 
                    value={[data.monthlyBill]} 
                    min={50} max={500} step={10} 
                    onValueChange={([v]) => setData({...data, monthlyBill: v})} 
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Battery className="h-5 w-5" />
                    </div>
                    <div>
                        <Label className="text-base cursor-pointer">{opsCopy.quoteAddBattery}</Label>
                        <p className="text-xs text-muted-foreground">{opsCopy.quoteBatteryBonus}</p>
                    </div>
                </div>
                <Switch 
                    checked={data.hasBattery} 
                    onCheckedChange={c => setData({...data, hasBattery: c})} 
                />
            </div>

            <div className="space-y-2">
                <Label>{opsCopy.quoteConsumptionProfile}</Label>
                <Select value={data.consumptionProfile} onValueChange={(v: QuoteData['consumptionProfile']) => setData({...data, consumptionProfile: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">{opsCopy.quoteConsumptionLow}</SelectItem>
                        <SelectItem value="normal">{opsCopy.quoteConsumptionNormal}</SelectItem>
                        <SelectItem value="high">{opsCopy.quoteConsumptionHigh}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
                <PriceListUpload />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN - RESULTS */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sun className="h-64 w-64 text-yellow-400" />
            </div>
            <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-emerald-400" />
                    {opsCopy.quoteSystemPerformance}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
                <div>
                    <p className="text-slate-400 text-sm">{opsCopy.quoteSystemSize}</p>
                    <p className="text-4xl font-bold">{data.kwp} kWp</p>
                    <p className="text-emerald-400 text-sm font-medium">{opsCopy.quotePanelsApprox} {Math.round(data.kwp * 3.7)} {opsCopy.quotePanels}</p>
                </div>
                <div>
                    <p className="text-slate-400 text-sm">{opsCopy.quoteEstProduction}</p>
                    <p className="text-3xl font-bold">{data.production.toLocaleString('fr')} kWh</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">{opsCopy.quotePaybackPeriod}</p>
                    <p className="text-5xl font-bold text-emerald-400">{data.paybackYears} <span className="text-xl font-normal text-white">{opsCopy.quoteYears}</span></p>
                    <p className="text-xs text-slate-400 mt-2">{opsCopy.quoteBasedOnPrices}</p>
                </div>
            </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white/90 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    {opsCopy.quoteFinancialBreakdown}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground text-sm">
                    <span>{opsCopy.quoteInstallationCost}</span>
                    <span className="line-through">{data.installCost.toLocaleString('fr')} €</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Klimabonus 2026</span>
                    <span>- {data.klimabonus.toLocaleString('fr')} €</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold text-slate-700">{opsCopy.quoteEstimatedNetCost}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 text-sm">{opsCopy.quoteIndicativeBand}</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            {data.netCostMin.toLocaleString('fr')} – {data.netCostMax.toLocaleString('fr')} €
                        </span>
                    </div>
                </div>
                
                <div className="pt-4 space-y-3">
                    <Button 
                        onClick={handleAddToPipeline}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 text-lg shadow-lg hover:shadow-blue-500/25"
                    >
                        {opsCopy.quoteAddToPipeline} <PlusCircle className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                        onClick={handleDownloadPDF} 
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg shadow-lg hover:shadow-emerald-500/25"
                    >
                        {isGenerating ? opsCopy.quoteGenerating : opsCopy.quoteGeneratePDF} <FileText className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                        onClick={handleWhatsApp}
                        variant="outline" 
                        className="w-full h-12 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        {opsCopy.quoteSendWhatsApp} <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTitle className="font-bold flex items-center gap-2">
                ⚠️ Pricing Note
            </AlertTitle>
            <AlertDescription>
                Connect your Excel price list for exact margins. This demo uses approximate market rates (Basic €2,100/kWp, Premium €2,400/kWp; battery +€6,500).
            </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
