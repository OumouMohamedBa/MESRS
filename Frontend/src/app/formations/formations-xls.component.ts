import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormationService } from './formation.service';
import { Formation, UploadedDoc } from './formation.model';

@Component({
  selector: 'app-formations-xls',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './formations-xls.component.html'
})
export class FormationsXlsComponent implements OnInit {
  formation: Formation | null = null;
  id!: string;
  year = '';
  level = '';
  index = 0;
  doc: UploadedDoc | null = null;
  isFullscreen = false;
  // SheetJS state
  sheetNames: string[] = [];
  selectedSheet = '';
  rows: any[][] = [];
  loading = false;
  errorMsg = '';
  headerHasValues = false;
  colCount = 0;

  // Helpers pour le template
  padCount(row: any[]): number { return Math.max(0, this.colCount - ((row && row.length) || 0)); }
  arrayN(n: number): any[] { return Array.from({ length: Math.max(0, Number(n) || 0) }); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: FormationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = String(idParam);
    if (!this.id) {
      this.router.navigate(['/formations']);
      return;
    }
    this.formation = this.svc.getById(this.id);
    if (!this.formation) {
      this.router.navigate(['/formations']);
      return;
    }
    const qp = this.route.snapshot.queryParamMap;
    this.year = qp.get('year') || '';
    this.level = qp.get('level') || '';
    this.index = Number(qp.get('index') || '0');

    const list = this.formation.imports?.[this.year]?.[this.level] || [];
    this.doc = list[this.index] || null;
    if (!this.doc || !this.doc.url) {
      this.router.navigate(['/formations', this.id]);
      return;
    }
    // Charger le fichier et parser
    this.loadWorkbook(this.doc.url).then(() => {
      if (this.sheetNames.length) this.loadSheet(this.sheetNames[0]);
    });
  }

  private async loadWorkbook(url: string) {
    try {
      this.loading = true;
      this.errorMsg = '';
      // Import dynamique de SheetJS depuis la dépendance locale
      const XLSX = await import('xlsx');
      let buf: ArrayBuffer | null = null;
      try {
        // Stratégie 1: fetch direct ArrayBuffer (ok pour http(s) et blob:)
        const resp = await fetch(url);
        buf = await resp.arrayBuffer();
      } catch (_) {
        // Stratégie 2: via Blob + FileReader (fallback)
        const resp = await fetch(url);
        const blob = await resp.blob();
        buf = await blob.arrayBuffer();
      }
      if (!buf) throw new Error('buffer-empty');
      const wb = XLSX.read(buf, { type: 'array' });
      this.sheetNames = wb.SheetNames || [];
      // stocker le workbook pour relecture des feuilles
      (this as any)._wb = wb;
      (this as any)._xlsx = XLSX;
      if (!this.sheetNames.length) {
        this.errorMsg = 'Aucune feuille détectée dans ce fichier.';
      }
    } catch (e: any) {
      this.errorMsg = 'Impossible de lire le fichier Excel.';
    } finally {
      this.loading = false;
    }
  }

  loadSheet(name: string) {
    const wb = (this as any)._wb;
    const XLSX = (this as any)._xlsx;
    if (!wb) return;
    this.selectedSheet = name;
    const ws = wb.Sheets[name];
    const arr = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true }) as any[][];
    // Normaliser: remplacer undefined par '' pour l'affichage
    const normalized = (arr || []).map(r => Array.isArray(r) ? r.map(c => (c == null ? '' : c)) : []);
    this.rows = normalized;
    // Calcul nombre de colonnes max
    this.colCount = this.rows.reduce((m, r) => Math.max(m, r.length || 0), 0);
    // Déterminer si la première ligne contient au moins une valeur non vide
    this.headerHasValues = !!(this.rows[0] || []).some((v: any) => v !== '' && v != null);
  }

  toggleFullscreen(): void {
    if (!this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  }

  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:msfullscreenchange', ['$event'])
  onFullscreenChange(): void {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
  }

  getTitle(): string {
    const base = this.formation?.nomFiliere || 'Formation';
    return `${base} • ${this.year} ${this.level}`;
  }
}
