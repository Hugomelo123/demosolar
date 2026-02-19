import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PriceListUpload } from './PriceListUpload';
import { QuoteData } from '@/types';
import { calculateKwp, calculateProduction, calculateKlimabonus, calculateCost, calculateAnnualSavings, calculatePayback } from '@/lib/calculations';
import { generateQuotePDF } from '@/lib/pdf';
import { FileText, Send, Zap, Sun, Wallet, Battery } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function QuoteForm() {
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
    annualSavings: 0,
    paybackYears: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Recalculate whenever inputs change
  useEffect(() => {
    const kwp = calculateKwp(data.areaM2);
    const production = calculateProduction(kwp);
    const installCost = calculateCost(kwp, data.packageType) + (data.hasBattery ? 6500 : 0); // approx battery cost
    const klimabonus = calculateKlimabonus(kwp, data.hasBattery);
    const netCost = installCost - klimabonus;
    const annualSavings = calculateAnnualSavings(data.monthlyBill, data.consumptionProfile) + (data.hasBattery ? 200 : 0); // extra savings with battery
    const paybackYears = calculatePayback(netCost, annualSavings);

    setData(prev => ({
      ...prev,
      kwp,
      production,
      installCost,
      klimabonus,
      netCost,
      annualSavings,
      paybackYears,
    }));
  }, [data.areaM2, data.packageType, data.hasBattery, data.monthlyBill, data.consumptionProfile]);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
        const pdfBytes = await generateQuotePDF(data);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `SolarQuote_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
    } catch (error) {
        console.error("PDF Error", error);
        alert("Failed to generate PDF");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Bonjour! Voici une estimation pour ${data.address}: ${data.kwp} kWp, Coût net: ${data.netCost}€. Prochaine étape: visite technique?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* LEFT COLUMN - INPUTS */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter client details to generate an instant quote.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Full Address</Label>
                <Input 
                    value={data.address} 
                    onChange={e => setData({...data, address: e.target.value})} 
                    placeholder="e.g. 24 Rue de la Gare, L-1234 Luxembourg"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Roof Type</Label>
                    <Select value={data.roofType} onValueChange={(v: any) => setData({...data, roofType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pitched">Pitched Roof</SelectItem>
                            <SelectItem value="flat">Flat Roof</SelectItem>
                            <SelectItem value="facade">Facade</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Package</Label>
                    <Select value={data.packageType} onValueChange={(v: any) => setData({...data, packageType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic (Q-Cells)</SelectItem>
                            <SelectItem value="premium">Premium (SunPower)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <Label>Roof Area</Label>
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
                    <Label>Monthly Electricity Bill</Label>
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
                        <Label className="text-base cursor-pointer">Add Battery Storage (10kWh)</Label>
                        <p className="text-xs text-muted-foreground">+2250€ Klimabonus bonus</p>
                    </div>
                </div>
                <Switch 
                    checked={data.hasBattery} 
                    onCheckedChange={c => setData({...data, hasBattery: c})} 
                />
            </div>

            <div className="space-y-2">
                <Label>Consumption Profile</Label>
                <Select value={data.consumptionProfile} onValueChange={(v: any) => setData({...data, consumptionProfile: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low Daytime Usage (Working couple)</SelectItem>
                        <SelectItem value="normal">Normal Family Usage</SelectItem>
                        <SelectItem value="high">High Daytime Usage (Home office/EV)</SelectItem>
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
                    System Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
                <div>
                    <p className="text-slate-400 text-sm">System Size</p>
                    <p className="text-4xl font-bold">{data.kwp} kWp</p>
                    <p className="text-emerald-400 text-sm font-medium">Approx. {Math.round(data.kwp * 3.7)} panels</p>
                </div>
                <div>
                    <p className="text-slate-400 text-sm">Est. Annual Production</p>
                    <p className="text-3xl font-bold">{data.production.toLocaleString()} kWh</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-slate-300 text-sm mb-1">Payback Period</p>
                    <p className="text-5xl font-bold text-emerald-400">{data.paybackYears} <span className="text-xl font-normal text-white">years</span></p>
                    <p className="text-xs text-slate-400 mt-2">Based on current energy prices</p>
                </div>
            </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white/90 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    Financial Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Installation Cost</span>
                    <span className="line-through">{data.installCost.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Klimabonus 2026</span>
                    <span>- {data.klimabonus.toLocaleString()} €</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-slate-700">NET COST</span>
                    <span className="text-4xl font-extrabold text-slate-900">{data.netCost.toLocaleString()} €</span>
                </div>
                
                <div className="pt-4 space-y-3">
                    <Button 
                        onClick={handleDownloadPDF} 
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg shadow-lg hover:shadow-emerald-500/25"
                    >
                        {isGenerating ? "Generating..." : "Generate Professional PDF"} <FileText className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                        onClick={handleWhatsApp}
                        variant="outline" 
                        className="w-full h-12 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        Send via WhatsApp <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTitle className="font-bold flex items-center gap-2">
                ⚠️ Pricing Note
            </AlertTitle>
            <AlertDescription>
                Connect your Excel price list for exact margins. This demo uses approximate market rates (2100-2400€/kWp).
            </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
