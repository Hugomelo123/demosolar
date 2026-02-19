import React, { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent } from './ui/card';

// Minimal Table component mock since I didn't create the ui/table file yet
// Wait, I should probably just use divs for speed if I didn't create table.
// But Table is better. I'll mock it inline or just use divs.
// Actually, I'll just use a simple HTML table styled with Tailwind.

export function PriceListUpload() {
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(0, 6); // Preview first 5 + header
      const rows = lines.map(line => line.split(','));
      setData(rows);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Price List (CSV)
          </Button>
        </div>
        {fileName && <span className="text-sm text-muted-foreground flex items-center gap-1"><FileSpreadsheet className="h-4 w-4" /> {fileName}</span>}
      </div>

      {data.length > 0 && (
        <Card className="bg-slate-50 border-dashed border-slate-300">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Preview (Top 5 rows)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    {data[0].map((header, i) => (
                      <th key={i} className="py-2 px-2 font-medium text-slate-600">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(1).map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 px-2 text-slate-600">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              * This is a demo preview. Prices in the calculator are currently using the demo logic.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
