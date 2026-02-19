import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { QuoteData } from '../types';

export async function generateQuotePDF(data: QuoteData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // --- Page 1: Cover ---
  const page1 = pdfDoc.addPage();
  const { width, height } = page1.getSize();

  const drawText = (text: string, x: number, y: number, size: number = 12, font = timesRomanFont, color = rgb(0, 0, 0)) => {
    page1.drawText(text, { x, y, size, font, color });
  };

  drawText('SolarOps Luxembourg', 50, height - 80, 24, timesBoldFont, rgb(0, 0.5, 0));
  drawText('Premium Solar Installation Proposal', 50, height - 120, 18, timesRomanFont);
  drawText('Klimabonus 2026 Included', 50, height - 150, 14, timesBoldFont, rgb(0, 0.6, 0.3));

  drawText(`Prepared for: ${data.address}`, 50, height - 250, 14);
  drawText(`Date: ${new Date().toLocaleDateString('lb-LU')}`, 50, height - 275, 14);
  drawText(`Reference ID: REF-${Math.floor(Math.random() * 10000)}`, 50, height - 300, 14);

  // --- Page 2: Specs ---
  const page2 = pdfDoc.addPage();
  const drawText2 = (text: string, x: number, y: number, size: number = 12, font = timesRomanFont, color = rgb(0, 0, 0)) => {
    page2.drawText(text, { x, y, size, font, color });
  };

  drawText2('System Specifications', 50, height - 80, 20, timesBoldFont);

  let yPos = height - 150;
  const addSpec = (label: string, value: string) => {
    drawText2(label, 50, yPos, 12, timesBoldFont);
    drawText2(value, 250, yPos, 12);
    yPos -= 30;
  };

  addSpec('Roof Type', data.roofType.toUpperCase());
  addSpec('Roof Area', `${data.areaM2} m²`);
  addSpec('System Size', `${data.kwp} kWp`);
  addSpec('Panel Count', `${Math.round(data.kwp * 3.7)} panels`); // Approx 270W-400W panels logic
  addSpec('Inverter', 'Huawei SUN2000 (Premium)');
  addSpec('Battery Storage', data.hasBattery ? 'Yes (10kWh)' : 'No');
  addSpec('Estimated Annual Production', `${data.production.toLocaleString('lb-LU')} kWh/year`);

  // --- Page 3: Financials ---
  const page3 = pdfDoc.addPage();
  const drawText3 = (text: string, x: number, y: number, size: number = 12, font = timesRomanFont, color = rgb(0, 0, 0)) => {
    page3.drawText(text, { x, y, size, font, color });
  };

  drawText3('Financial Breakdown', 50, height - 80, 20, timesBoldFont);

  yPos = height - 150;
  
  drawText3('Installation Cost', 50, yPos, 14, timesRomanFont, rgb(0.5, 0.5, 0.5));
  drawText3(`${data.installCost.toLocaleString('lb-LU')} €`, 300, yPos, 14, timesRomanFont, rgb(0.5, 0.5, 0.5));
  page3.drawLine({
    start: { x: 50, y: yPos + 5 },
    end: { x: 400, y: yPos + 5 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPos -= 40;
  drawText3('Klimabonus Subsidy', 50, yPos, 14, timesBoldFont, rgb(0, 0.6, 0.3));
  drawText3(`- ${data.klimabonus.toLocaleString('lb-LU')} €`, 300, yPos, 14, timesBoldFont, rgb(0, 0.6, 0.3));

  yPos -= 50;
  drawText3('NET COST TO CLIENT', 50, yPos, 18, timesBoldFont);
  drawText3(`${data.netCost.toLocaleString('lb-LU')} €`, 300, yPos, 18, timesBoldFont);

  yPos -= 80;
  drawText3(`Annual Savings: ${data.annualSavings.toLocaleString('lb-LU')} €`, 50, yPos, 14);
  yPos -= 30;
  drawText3(`Payback Period: ${data.paybackYears} years`, 50, yPos, 14, timesBoldFont, rgb(0, 0.6, 0.3));

  yPos -= 100;
  drawText3('Valid for 14 days', 50, yPos, 10, timesRomanFont);
  yPos -= 20;
  drawText3('Timeline: 6-10 weeks after CREOS approval', 50, yPos, 10, timesRomanFont);
  yPos -= 20;
  drawText3('Payment terms: 30% deposit / 70% after commissioning', 50, yPos, 10, timesRomanFont);

  // Signature box
  yPos -= 100;
  page3.drawRectangle({
    x: 50,
    y: yPos - 50,
    width: 200,
    height: 80,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  drawText3('Client Signature', 60, yPos + 10, 10);

  page3.drawRectangle({
    x: 300,
    y: yPos - 50,
    width: 200,
    height: 80,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  drawText3('Installer Signature', 310, yPos + 10, 10);

  // Footer on all pages
  [page1, page2, page3].forEach(page => {
    const { width } = page.getSize();
    page.drawText('DEMO MODE - Not a binding offer', {
      x: width / 2 - 100,
      y: 20,
      size: 10,
      font: timesRomanFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
