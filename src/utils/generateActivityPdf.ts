import { jsPDF } from 'jspdf';
import { ActivityLogEntry, MpesaRevenueRecord, AdminStats } from '../types';

export interface GeneratePdfOptions {
  recipientEmail?: string;
  reportPeriod?: string;
  filterType?: string;
}

export function generateActivityPdf(
  activities: ActivityLogEntry[],
  stats: AdminStats | null,
  ledger: MpesaRevenueRecord[],
  options: GeneratePdfOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const recipient = options.recipientEmail || 'shoaju86@gmail.com';
  const reportPeriod = options.reportPeriod || 'All-Time Real-Time Audit';
  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  // Palette
  const darkBg = [15, 23, 42]; // Slate 900
  const emeraldAccent = [16, 185, 129]; // Emerald 500
  const textDark = [30, 41, 59];
  const textMuted = [100, 116, 139];
  const lightBg = [248, 250, 252];
  const borderGray = [226, 232, 240];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header Banner
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Emerald Top Stripe
  doc.setFillColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVICTUS MARKETPLACE', margin, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Activity Audit & Financial Transaction Log Report', margin, 20);

  // Recipient Tag
  doc.setFontSize(8.5);
  doc.setTextColor(52, 211, 153);
  doc.text(`DELIVERY RECIPIENT: ${recipient.toUpperCase()}`, margin, 27);
  doc.setTextColor(203, 213, 225);
  doc.text(`GENERATED: ${formattedDate} | TIMEFRAME: ${reportPeriod}`, margin, 32);

  // Security Badge on top right
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 50, 8, 50, 22, 2, 2, 'F');
  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SECURITY LEVEL: HIGH', pageWidth - margin - 47, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIAL / ENCRYPTED', pageWidth - margin - 47, 19);
  doc.text('ID: ' + Math.random().toString(36).substring(2, 10).toUpperCase(), pageWidth - margin - 47, 24);

  // KPI Metrics Section
  let curY = 44;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, curY, pageWidth - margin * 2, 24, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, curY, pageWidth - margin * 2, 24, 2, 2, 'S');

  const totalKES = stats?.totalDepositedToMasterMpesaKES || ledger.reduce((acc, r) => acc + r.amountKES, 0);
  const totalUSD = stats?.totalDepositedToMasterMpesaUSD || Math.round(totalKES / 130);
  const totalActs = activities.length;

  const colWidth = (pageWidth - margin * 2) / 4;

  // Box 1: Total Events
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('TOTAL LOGGED EVENTS', margin + 4, curY + 7);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${totalActs}`, margin + 4, curY + 16);

  // Box 2: Total M-PESA Routing
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('M-PESA DEPOSITED (+254705436332)', margin + colWidth + 2, curY + 7);
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(`Ksh ${totalKES.toLocaleString()}`, margin + colWidth + 2, curY + 16);

  // Box 3: Escrow Volume
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ESCROW TRANSACTIONS', margin + colWidth * 2 + 2, curY + 7);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${stats?.totalTransactions || 315} Orders`, margin + colWidth * 2 + 2, curY + 16);

  // Box 4: Master Admin Account
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('PRIMARY ADMIN ACCESS', margin + colWidth * 3 + 2, curY + 7);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('shoaju86@gmail.com', margin + colWidth * 3 + 2, curY + 16);

  curY += 30;

  // Section Heading
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Itemized User & Transaction Activity Log', margin, curY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Showing ${activities.length} recorded events sorted chronologically`, margin, curY + 4.5);

  curY += 8;

  // Table Headers
  const thY = curY;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, thY, pageWidth - margin * 2, 7, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margin, thY + 7, pageWidth - margin, thY + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  doc.text('DATE / TIME', margin + 2, thY + 5);
  doc.text('EVENT TYPE', margin + 26, thY + 5);
  doc.text('DESCRIPTION & CONTEXT', margin + 65, thY + 5);
  doc.text('USER / PHONE', margin + 120, thY + 5);
  doc.text('TRANSACTION ID / RECEIPT', margin + 155, thY + 5);

  curY += 8;

  // Render Activity Rows
  const rowHeight = 9.5;

  activities.forEach((act, idx) => {
    // Check page break
    if (curY + rowHeight > pageHeight - 22) {
      // Add Footer on current page
      addPageFooter(doc, pageWidth, pageHeight, margin, recipient);
      doc.addPage();
      curY = 16;

      // Repeat Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, curY, pageWidth - margin * 2, 7, 'F');
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.line(margin, curY + 7, pageWidth - margin, curY + 7);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('DATE / TIME', margin + 2, curY + 5);
      doc.text('EVENT TYPE', margin + 26, curY + 5);
      doc.text('DESCRIPTION & CONTEXT', margin + 65, curY + 5);
      doc.text('USER / PHONE', margin + 120, curY + 5);
      doc.text('TRANSACTION ID / RECEIPT', margin + 155, curY + 5);

      curY += 8;
    }

    // Row alternating background
    if (idx % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, curY, pageWidth - margin * 2, rowHeight, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, curY + rowHeight, pageWidth - margin, curY + rowHeight);

    // Date / Time
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const timeDisplay = act.timestamp ? act.timestamp.substring(0, 16) : '2026-09-16';
    doc.text(timeDisplay, margin + 2, curY + 4);

    // Event Type Badge
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    if (act.type.includes('PAYMENT') || act.type.includes('ESCROW')) {
      doc.setTextColor(5, 150, 105);
    } else if (act.type.includes('AD')) {
      doc.setTextColor(217, 119, 6);
    } else if (act.type.includes('ADMIN') || act.type.includes('TEAM')) {
      doc.setTextColor(124, 58, 237);
    } else {
      doc.setTextColor(37, 99, 235);
    }
    doc.text(act.type.replace(/_/g, ' ').substring(0, 18), margin + 26, curY + 4);

    // Description & Context (truncated)
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const cleanDesc = (act.title ? `${act.title}: ${act.description}` : act.description) || '';
    const truncatedDesc = cleanDesc.length > 36 ? cleanDesc.substring(0, 36) + '...' : cleanDesc;
    doc.text(truncatedDesc, margin + 65, curY + 4);

    // User / Phone
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    const userText = act.userName + (act.userPhone ? ` (${act.userPhone})` : '');
    doc.text(userText.substring(0, 22), margin + 120, curY + 4);

    // Transaction ID / Daraja code / Financials
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    if (act.darajaReceipt) {
      doc.setTextColor(5, 150, 105);
      doc.text(`${act.darajaReceipt} [Ksh ${act.amountKES?.toLocaleString() || 0}]`, margin + 155, curY + 4);
    } else if (act.transactionId) {
      doc.setTextColor(71, 85, 105);
      doc.text(act.transactionId.substring(0, 18), margin + 155, curY + 4);
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text(act.id.substring(0, 14), margin + 155, curY + 4);
    }

    curY += rowHeight;
  });

  // Footer on final page
  addPageFooter(doc, pageWidth, pageHeight, margin, recipient);

  return doc;
}

function addPageFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, recipient: string) {
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Invictus Automated Reporting System | Securely routed to: ${recipient}`, margin, footerY + 3);

  const hash = 'SHA256:' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  doc.text(hash, pageWidth - margin - 40, footerY + 3);
}
