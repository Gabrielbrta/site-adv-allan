import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

export interface CalculadoraPdfSection {
  title: string;
  rows: readonly CalculadoraPdfRow[];
}

export interface CalculadoraPdfRow {
  label: string;
  value: string;
  emphasize?: boolean;
}

export interface CalculadoraPdfReport {
  title: string;
  calculationType: string;
  issuedAt: Date;
  employeeName?: string;
  sections: readonly CalculadoraPdfSection[];
  totalLabel: string;
  totalValue: string;
  note?: string;
}

interface ContactItem {
  label: string;
  value: string;
}

type PdfColors = {
  black: [number, number, number];
  yellow: [number, number, number];
  muted: [number, number, number];
  line: [number, number, number];
  soft: [number, number, number];
  white: [number, number, number];
};

const CONTACTS: readonly ContactItem[] = [
  { label: 'WhatsApp', value: '+55 (13) 99689-9084' },
  { label: 'WhatsApp', value: '+55 (13) 99634-9939' },
  { label: 'E-mail', value: 'allansilvarodrigues2@gmail.com' },
  { label: 'Instagram', value: '@allanrodrigues.adv' },
  { label: 'TikTok', value: '@allan.rodrigues.adv' },
  { label: 'LinkedIn', value: 'allan-rodrigues-3a29b333b' },
];

@Injectable({ providedIn: 'root' })
export class CalculadoraPdfService {
  async download(report: CalculadoraPdfReport): Promise<void> {
    const document = new jsPDF({ unit: 'mm', format: 'a4' });
    const logo = await this.loadLogo();
    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const colors: PdfColors = {
      black: [27, 26, 24] as [number, number, number],
      yellow: [238, 185, 19] as [number, number, number],
      muted: [102, 99, 94] as [number, number, number],
      line: [225, 222, 216] as [number, number, number],
      soft: [248, 246, 241] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
    };
    let cursorY = margin;

    if (logo) {
      document.addImage(logo, 'WEBP', margin, cursorY, 52, 14, undefined, 'FAST');
    } else {
      document.setFont('helvetica', 'bold');
      document.setFontSize(15);
      document.setTextColor(...colors.black);
      document.text('ALLAN RODRIGUES ADVOCACIA', margin, cursorY + 8);
    }

    document.setFont('helvetica', 'normal');
    document.setFontSize(8);
    document.setTextColor(...colors.muted);
    document.text('RELATORIO DE ESTIMATIVA TRABALHISTA', pageWidth - margin, cursorY + 4, { align: 'right' });
    document.text(this.formatDate(report.issuedAt), pageWidth - margin, cursorY + 9, { align: 'right' });
    cursorY += 25;

    document.setFillColor(...colors.black);
    document.roundedRect(margin, cursorY, contentWidth, 25, 3, 3, 'F');
    document.setTextColor(...colors.white);
    document.setFont('helvetica', 'bold');
    document.setFontSize(17);
    document.text(report.title, margin + 7, cursorY + 11);
    document.setFont('helvetica', 'normal');
    document.setFontSize(9);
    document.text(report.employeeName ? `Titular: ${report.employeeName}` : report.calculationType, margin + 7, cursorY + 18);
    cursorY += 35;

    for (const section of report.sections) {
      cursorY = this.ensureSpace(document, cursorY, 28, pageHeight, margin, colors);
      document.setFillColor(...colors.yellow);
      document.rect(margin, cursorY, 3, 7, 'F');
      document.setTextColor(...colors.black);
      document.setFont('helvetica', 'bold');
      document.setFontSize(11);
      document.text(section.title, margin + 7, cursorY + 5.5);
      cursorY += 12;

      for (const row of section.rows) {
        const rowHeight = row.emphasize ? 11 : 8;
        cursorY = this.ensureSpace(document, cursorY, rowHeight + 3, pageHeight, margin, colors);
        if (row.emphasize) {
          document.setFillColor(...colors.soft);
          document.roundedRect(margin, cursorY - 2, contentWidth, rowHeight, 2, 2, 'F');
        }
        document.setFont('helvetica', row.emphasize ? 'bold' : 'normal');
        document.setFontSize(row.emphasize ? 10 : 9);
        document.setTextColor(...(row.emphasize ? colors.black : colors.muted));
        document.text(this.formatText(row.label), margin + 4, cursorY + 4);
        document.setTextColor(...colors.black);
        document.text(this.formatText(row.value), pageWidth - margin - 4, cursorY + 4, { align: 'right' });
        document.setDrawColor(...colors.line);
        if (!row.emphasize) {
          document.line(margin + 4, cursorY + 7, pageWidth - margin - 4, cursorY + 7);
        }
        cursorY += rowHeight;
      }
      cursorY += 5;
    }

    cursorY = this.ensureSpace(document, cursorY, 28, pageHeight, margin, colors);
    document.setFillColor(...colors.yellow);
    document.roundedRect(margin, cursorY, contentWidth, 20, 3, 3, 'F');
    document.setTextColor(...colors.black);
    document.setFont('helvetica', 'bold');
    document.setFontSize(10);
    document.text(report.totalLabel, margin + 7, cursorY + 8);
    document.setFontSize(15);
    document.text(report.totalValue, pageWidth - margin - 7, cursorY + 13, { align: 'right' });
    cursorY += 29;

    if (report.note) {
      cursorY = this.ensureSpace(document, cursorY, 24, pageHeight, margin, colors);
      document.setFont('helvetica', 'italic');
      document.setFontSize(8);
      document.setTextColor(...colors.muted);
      const noteLines = document.splitTextToSize(report.note, contentWidth - 8);
      document.text(noteLines, margin + 4, cursorY + 4);
      cursorY += Math.max(14, noteLines.length * 4 + 5);
    }

    const pageCount = document.getNumberOfPages();
    document.setPage(pageCount);
    this.addFooter(document, colors, pageWidth, pageHeight, margin);
    const fileName = `relatorio-${this.slugify(report.calculationType)}-${this.fileDate(report.issuedAt)}.pdf`;
    document.save(fileName);
  }

  private async loadLogo(): Promise<string | null> {
    if (typeof fetch === 'undefined') {
      return null;
    }

    try {
      const response = await fetch('images/AllanRodriguesADV_Logo-Escuro-fundo-branco.webp');
      if (!response.ok) {
        return null;
      }
      const blob = await response.blob();
      return await this.blobToDataUrl(blob);
    } catch {
      return null;
    }
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private ensureSpace(
    document: jsPDF,
    cursorY: number,
    requiredHeight: number,
    pageHeight: number,
    margin: number,
    colors: PdfColors,
  ): number {
    if (cursorY + requiredHeight <= pageHeight - 32) {
      return cursorY;
    }
    document.addPage();
    return margin;
  }

  private addFooter(
    document: jsPDF,
    colors: PdfColors,
    pageWidth: number,
    pageHeight: number,
    margin: number,
  ): void {
    const pageNumber = document.getCurrentPageInfo().pageNumber;
    const pageCount = document.getNumberOfPages();
    document.setDrawColor(...colors.line);
    document.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    document.setFont('helvetica', 'normal');
    document.setFontSize(7);
    document.setTextColor(...colors.muted);
    document.text('Allan Rodrigues Advocacia | Av. Presidente Wilson, 7, sobreloja 6, Santos/SP, 11065-200', margin, pageHeight - 19);
    document.text(`${CONTACTS[0].value} | ${CONTACTS[1].value} | ${CONTACTS[2].value}`, margin, pageHeight - 14);
    document.text(`Instagram ${CONTACTS[3].value} | TikTok ${CONTACTS[4].value} | LinkedIn ${CONTACTS[5].value}`, margin, pageHeight - 9);
    document.text(`Pagina ${pageNumber} de ${pageCount}`, pageWidth - margin, pageHeight - 4, { align: 'right' });
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  private formatText(value: string): string {
    const normalizedValue = value.replace(/_/g, ' ');
    return normalizedValue.replace(
      /(\d{4})-(\d{2})-(\d{2})/g,
      (_match, year: string, month: string, day: string) => `${day}/${month}/${year}`,
    );
  }

  private fileDate(date: Date): string {
    return new Intl.DateTimeFormat('en-CA').format(date);
  }

  private slugify(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
