import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { QuoteData } from '../types';
import { opsCopy } from '@/config/opsCopy';

const MARGIN = 52;
const CONTENT_W = 595 - MARGIN * 2;

/** WinAnsi-safe text (e.g. removes U+202F from toLocaleString('fr')). */
function pdfSafe(str: string): string {
  return str.replace(/\u202F/g, ' ').replace(/\u00A0/g, ' ');
}

function drawTableRow(
  page: { drawText: (t: string, o: object) => void; drawRectangle: (o: object) => void },
  x: number,
  y: number,
  label: string,
  value: string,
  opts: { font: any; fontBold: any; gray: ReturnType<typeof rgb>; dark: ReturnType<typeof rgb>; w: number; valueColor?: ReturnType<typeof rgb> }
) {
  const { font, fontBold, gray, dark, w, valueColor } = opts;
  const colVal = x + w - 120;
  page.drawText(pdfSafe(label), { x, y, size: 10, font, color: gray });
  page.drawText(pdfSafe(value), { x: colVal, y, size: 10, font: fontBold, color: valueColor ?? dark });
  page.drawRectangle({
    x,
    y: y - 4,
    width: w,
    height: 1,
    color: rgb(0.92, 0.92, 0.92),
  });
}

export async function generateQuotePDF(data: QuoteData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const green = rgb(0.11, 0.45, 0.28);
  const greenText = rgb(0.1, 0.55, 0.35);
  const gray = rgb(0.35, 0.35, 0.35);
  const grayLight = rgb(0.55, 0.55, 0.55);
  const dark = rgb(0.12, 0.12, 0.12);
  const white = rgb(1, 1, 1);

  const ref = `DEV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('fr', { day: '2-digit', month: 'long', year: 'numeric' });

  // ========== PAGE 1 ==========
  const page = pdfDoc.addPage();
  const w = page.getWidth();
  const h = page.getHeight();
  let y = h - MARGIN;

  // —— Header block (full width) ——
  const headerH = 52;
  page.drawRectangle({
    x: 0,
    y: h - headerH,
    width: w,
    height: headerH,
    color: green,
  });
  page.drawText(pdfSafe(opsCopy.companyName), {
    x: MARGIN,
    y: h - headerH + 18,
    size: 18,
    font: fontBold,
    color: white,
  });
  page.drawText(pdfSafe('DEVIS INSTALLATION PHOTOVOLTAIQUE'), {
    x: MARGIN,
    y: h - headerH + 4,
    size: 10,
    font: font,
    color: rgb(0.85, 0.95, 0.88),
  });
  y = h - headerH - 28;

  // —— Client & ref block (bordered) ——
  const boxY = y - 58;
  page.drawRectangle({
    x: MARGIN,
    y: boxY,
    width: CONTENT_W,
    height: 62,
    borderColor: rgb(0.88, 0.88, 0.88),
    borderWidth: 1,
  });
  page.drawText(pdfSafe('Destinataire'), { x: MARGIN + 12, y: boxY + 42, size: 8, font: font, color: grayLight });
  page.drawText(pdfSafe(data.address), { x: MARGIN + 12, y: boxY + 26, size: 11, font: fontBold, color: dark });
  page.drawText(pdfSafe(`Date: ${dateStr}`), { x: MARGIN + 12, y: boxY + 10, size: 9, font: font, color: gray });
  page.drawText(pdfSafe(`Reference: ${ref}`), {
    x: MARGIN + CONTENT_W - 140,
    y: boxY + 26,
    size: 11,
    font: fontBold,
    color: greenText,
  });
  page.drawText(pdfSafe('Klimabonus 2026 inclus'), {
    x: MARGIN + CONTENT_W - 140,
    y: boxY + 10,
    size: 8,
    font: font,
    color: grayLight,
  });
  y = boxY - 32;

  // —— Section 1: Caracteristiques ——
  page.drawText(pdfSafe('1. Caracteristiques du projet'), {
    x: MARGIN,
    y,
    size: 13,
    font: fontBold,
    color: dark,
  });
  y -= 6;
  page.drawRectangle({
    x: MARGIN,
    y: y,
    width: 80,
    height: 2,
    color: green,
  });
  y -= 22;

  const specs: [string, string][] = [
    [pdfSafe('Type de toit'), data.roofType === 'pitched' ? 'Incline' : data.roofType === 'flat' ? 'Plat' : 'Facade'],
    [pdfSafe('Surface toit'), `${data.areaM2} m²`],
    [pdfSafe('Puissance installée'), `${data.kwp} kWp`],
    [pdfSafe('Nombre de panneaux (est.)'), `${Math.round(data.kwp * 3.7)}`],
    [pdfSafe('Production annuelle estimée'), `${data.production.toLocaleString('fr')} kWh/an`],
    [pdfSafe('Stockage batterie'), data.hasBattery ? 'Oui (10 kWh)' : 'Non'],
  ];
  specs.forEach(([label, value]) => {
    drawTableRow(page, MARGIN, y, label, value, { font, fontBold, gray, dark, w: CONTENT_W });
    y -= 22;
  });
  y -= 28;

  // —— Section 2: Montant indicatif ——
  page.drawText(pdfSafe('2. Montant indicatif'), {
    x: MARGIN,
    y,
    size: 13,
    font: fontBold,
    color: dark,
  });
  y -= 6;
  page.drawRectangle({
    x: MARGIN,
    y: y,
    width: 60,
    height: 2,
    color: green,
  });
  y -= 22;

  drawTableRow(
    page,
    MARGIN,
    y,
    pdfSafe('Coût installation (HT)'),
    `${data.installCost.toLocaleString('fr')} EUR`,
    { font, fontBold, gray, dark, w: CONTENT_W }
  );
  y -= 22;
  drawTableRow(
    page,
    MARGIN,
    y,
    pdfSafe('Prime Klimabonus 2026 (indicatif)'),
    `- ${data.klimabonus.toLocaleString('fr')} EUR`,
    { font, fontBold, gray, dark, w: CONTENT_W, valueColor: greenText }
  );
  y -= 28;

  const minC = data.netCostMin ?? data.netCost;
  const maxC = data.netCostMax ?? data.netCost;
  const netStr = `${minC.toLocaleString('fr')} - ${maxC.toLocaleString('fr')} EUR`;
  page.drawRectangle({
    x: MARGIN,
    y: y - 6,
    width: CONTENT_W,
    height: 28,
    color: rgb(0.94, 0.98, 0.95),
  });
  page.drawRectangle({
    x: MARGIN,
    y: y - 6,
    width: CONTENT_W,
    height: 28,
    borderColor: greenText,
    borderWidth: 1,
  });
  page.drawText(pdfSafe('Coût net estimé (fourchette)'), {
    x: MARGIN + 12,
    y: y + 2,
    size: 11,
    font: fontBold,
    color: dark,
  });
  page.drawText(pdfSafe(netStr), {
    x: MARGIN + CONTENT_W - 130,
    y: y + 2,
    size: 14,
    font: fontBold,
    color: greenText,
  });
  y -= 40;

  page.drawText(pdfSafe('Offre ferme après visite technique sur site.'), {
    x: MARGIN,
    y,
    size: 9,
    font: font,
    color: grayLight,
  });
  y -= 24;

  page.drawText(pdfSafe(`Economies annuelles (est.): ${data.annualSavings.toLocaleString('fr')} EUR`), {
    x: MARGIN,
    y,
    size: 10,
    font: font,
    color: dark,
  });
  y -= 16;
  page.drawText(pdfSafe(`Retour sur investissement (est.): ${data.paybackYears} ans`), {
    x: MARGIN,
    y,
    size: 10,
    font: fontBold,
    color: greenText,
  });
  y -= 28;

  // —— Section 3: Conditions ——
  page.drawText(pdfSafe('3. Conditions'), {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: dark,
  });
  y -= 18;
  page.drawText(pdfSafe(`Validite: ${opsCopy.pdfValidDays}. ${opsCopy.pdfTimeline}.`), {
    x: MARGIN,
    y,
    size: 9,
    font: font,
    color: gray,
  });
  y -= 14;
  page.drawText(pdfSafe('Paiement: 30% à la commande, 70% après mise en service.'), {
    x: MARGIN,
    y,
    size: 9,
    font: font,
    color: gray,
  });
  y -= 14;
  page.drawText(pdfSafe('Klimabonus indicatif. Prefinancement possible si installateur agree (Guichet.lu).'), {
    x: MARGIN,
    y,
    size: 8,
    font: font,
    color: grayLight,
  });

  // —— Footer ——
  page.drawRectangle({
    x: 0,
    y: 0,
    width: w,
    height: 28,
    color: rgb(0.97, 0.97, 0.97),
  });
  page.drawText(pdfSafe(`${ref} - ${opsCopy.companyName}`), {
    x: MARGIN,
    y: 8,
    size: 8,
    font: font,
    color: grayLight,
  });
  page.drawText(pdfSafe("Document indicatif. Offre ferme après visite."), {
    x: w - MARGIN - 200,
    y: 8,
    size: 8,
    font: font,
    color: grayLight,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
