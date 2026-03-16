import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { QuoteData } from '@/types';
import { calculateKwp, calculateProduction, calculateKlimabonus, calculateCost, calculateAnnualSavings, calculatePayback, calculateNetCost, calculateNetCostRange, isMarginBelowMinimum, MIN_MARGIN_PERCENT, BATTERY_ADDON_EUR, BATTERY_EXTRA_SAVINGS_EUR } from '@/lib/calculations';
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
    address: '',
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
    const installCost = calculateCost(kwp, data.packageType) + (data.hasBattery ? BATTERY_ADDON_EUR : 0);
    const klimabonus = calculateKlimabonus(kwp, data.hasBattery);
    const netCost = calculateNetCost(installCost, klimabonus); // never negative
    const { min: netCostMin, max: netCostMax, mid: netCostMid } = calculateNetCostRange(netCost);
    const annualSavings = calculateAnnualSavings(data.monthlyBill, data.consumptionProfile) + (data.hasBattery ? BATTERY_EXTRA_SAVINGS_EUR : 0);
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
      {/* Live summary strip — visible when we have data */}
      {data.kwp > 0 && (
        <div className="lg:col-span-12 flex flex-wrap items-center gap-6 rounded-xl bg-slate-100/90 border border-slate-200/80 px-5 py-4 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium">Puissance</span>
            <span className="text-xl font-bold text-slate-800">{data.kwp} kWp</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium">Coût net indicatif</span>
            <span className="text-xl font-bold text-emerald-700">
              {data.netCostMin.toLocaleString('fr')} – {data.netCostMax.toLocaleString('fr')} €
            </span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium">Retour sur invest.</span>
            <span className="text-xl font-bold text-slate-800">{data.paybackYears} ans</span>
          </div>
        </div>
      )}

      {/* LEFT COLUMN - INPUTS */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border border-slate-200/80 shadow-md bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{opsCopy.quoteProjectDetails}</CardTitle>
            <CardDescription>{opsCopy.quoteProjectDetailsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Section: Client */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                {opsCopy.quoteSectionClient}
                <span className="h-px flex-1 bg-slate-200" />
              </h3>
              <div className="grid gap-4 sm:grid-cols-1">
                <div className="space-y-2">
                  <Label>{opsCopy.quoteClientName}</Label>
                  <Input
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder={opsCopy.quoteClientPlaceholder}
                    className="bg-slate-50/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{opsCopy.quoteFullAddress}</Label>
                  <Input
                    value={data.address}
                    onChange={e => setData({ ...data, address: e.target.value })}
                    placeholder={opsCopy.quoteAddressPlaceholder}
                    className="bg-slate-50/80"
                  />
                </div>
              </div>
            </div>

            {/* Section: Installation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                {opsCopy.quoteSectionInstall}
                <span className="h-px flex-1 bg-slate-200" />
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{opsCopy.quoteRoofType}</Label>
                  <Select value={data.roofType} onValueChange={(v: QuoteData['roofType']) => setData({ ...data, roofType: v })}>
                    <SelectTrigger className="bg-slate-50/80"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pitched">{opsCopy.quoteRoofPitched}</SelectItem>
                      <SelectItem value="flat">{opsCopy.quoteRoofFlat}</SelectItem>
                      <SelectItem value="facade">{opsCopy.quoteRoofFacade}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{opsCopy.quotePackage}</Label>
                  <Select value={data.packageType} onValueChange={(v: QuoteData['packageType']) => setData({ ...data, packageType: v })}>
                    <SelectTrigger className="bg-slate-50/80"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">{opsCopy.quotePackageBasic}</SelectItem>
                      <SelectItem value="premium">{opsCopy.quotePackagePremium}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label>{opsCopy.quoteRoofArea}</Label>
                  <span className="font-semibold text-emerald-700">{data.areaM2} m²</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 px-0.5">
                  <span>10 m²</span>
                  <span>200 m²</span>
                </div>
                <Slider
                  value={[data.areaM2]}
                  min={10}
                  max={200}
                  step={1}
                  onValueChange={([v]) => setData({ ...data, areaM2: v })}
                  className="py-2"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50/50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Battery className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-base font-medium cursor-pointer">{opsCopy.quoteAddBattery}</Label>
                    <p className="text-xs text-muted-foreground">{opsCopy.quoteBatteryBonus}</p>
                  </div>
                </div>
                <Switch
                  checked={data.hasBattery}
                  onCheckedChange={c => setData({ ...data, hasBattery: c })}
                />
              </div>
            </div>

            {/* Section: Consommation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                {opsCopy.quoteSectionConsumption}
                <span className="h-px flex-1 bg-slate-200" />
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label>{opsCopy.quoteMonthlyBill}</Label>
                  <span className="font-semibold text-emerald-700">{data.monthlyBill} €</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 px-0.5">
                  <span>50 €</span>
                  <span>500 €</span>
                </div>
                <Slider
                  value={[data.monthlyBill]}
                  min={50}
                  max={500}
                  step={10}
                  onValueChange={([v]) => setData({ ...data, monthlyBill: v })}
                  className="py-2"
                />
              </div>
              <div className="space-y-2">
                <Label>{opsCopy.quoteConsumptionProfile}</Label>
                <Select value={data.consumptionProfile} onValueChange={(v: QuoteData['consumptionProfile']) => setData({ ...data, consumptionProfile: v })}>
                  <SelectTrigger className="bg-slate-50/80"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{opsCopy.quoteConsumptionLow}</SelectItem>
                    <SelectItem value="normal">{opsCopy.quoteConsumptionNormal}</SelectItem>
                    <SelectItem value="high">{opsCopy.quoteConsumptionHigh}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN - RESULTS */}
      <div className="lg:col-span-5 space-y-6 sticky top-24">
        <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-900/30 text-white border-0 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 p-4 opacity-5">
            <Sun className="h-40 w-40 text-amber-400" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-emerald-300 flex items-center gap-2 text-base font-semibold">
              <Zap className="h-5 w-5 fill-emerald-400 text-emerald-400" />
              {opsCopy.quoteSystemPerformance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-xs uppercase tracking-wider">{opsCopy.quoteSystemSize}</p>
                <p className="text-3xl font-bold mt-1">{data.kwp} kWp</p>
                <p className="text-emerald-300/90 text-xs mt-1">{opsCopy.quotePanelsApprox} {Math.round(data.kwp * 3.7)} {opsCopy.quotePanels}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-xs uppercase tracking-wider">{opsCopy.quoteEstProduction}</p>
                <p className="text-2xl font-bold mt-1">{data.production.toLocaleString('fr')}</p>
                <p className="text-slate-400 text-xs mt-1">kWh/an</p>
              </div>
            </div>
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 p-5">
              <p className="text-slate-300 text-sm">{opsCopy.quotePaybackPeriod}</p>
              <p className="text-4xl font-bold text-emerald-300 mt-1">{data.paybackYears} <span className="text-lg font-normal text-white/90">{opsCopy.quoteYears}</span></p>
              <p className="text-xs text-slate-400 mt-2">{opsCopy.quoteBasedOnPrices}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Wallet className="h-5 w-5 text-emerald-600" />
              {opsCopy.quoteFinancialBreakdown}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>{opsCopy.quoteInstallationCost}</span>
              <span className="line-through">{data.installCost.toLocaleString('fr')} €</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold text-sm">
              <span>Klimabonus 2026</span>
              <span>- {data.klimabonus.toLocaleString('fr')} €</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-slate-600 text-sm font-medium mb-1">{opsCopy.quoteEstimatedNetCost}</p>
              <p className="text-2xl font-bold text-emerald-800">
                {data.netCostMin.toLocaleString('fr')} – {data.netCostMax.toLocaleString('fr')} €
              </p>
              <p className="text-xs text-slate-500 mt-1">{opsCopy.quoteIndicativeBand}</p>
            </div>

            {isMarginBelowMinimum(data.installCost, data.netCostMin) && (
              <Alert className="bg-amber-50 border-amber-300 text-amber-900">
                <AlertTitle className="font-bold text-sm">{opsCopy.quoteMarginAlertTitle}</AlertTitle>
                <AlertDescription className="text-sm">
                  {opsCopy.quoteMarginAlertDesc} (marge min. {Math.round(MIN_MARGIN_PERCENT * 100)} %)
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-2 space-y-3">
              <Button
                onClick={handleAddToPipeline}
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-medium shadow-md"
              >
                {opsCopy.quoteAddToPipeline} <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md"
              >
                {isGenerating ? opsCopy.quoteGenerating : opsCopy.quoteGeneratePDF} <FileText className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                {opsCopy.quoteSendWhatsApp} <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-slate-50 border-slate-200 text-slate-700">
          <AlertTitle className="font-semibold text-sm">{opsCopy.quotePricingNoteTitle}</AlertTitle>
          <AlertDescription className="text-xs">
            {opsCopy.quotePricingNoteBody}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
