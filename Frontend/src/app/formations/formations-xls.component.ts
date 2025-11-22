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
  doc: any = null; // Changé pour accepter le format du backend
  isFullscreen = false;
  // SheetJS state
  sheetNames: string[] = [];
  selectedSheet = '';
  rows: any[][] = [];
  loading = false;
  errorMsg = '';
  headerHasValues = false;
  colCount = 0;
  importsList: any[] = []; // Liste des imports depuis le backend

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

    // Charger la formation
    this.svc.getById(this.id).subscribe({
      next: formation => {
        if (!formation) {
          this.router.navigate(['/formations']);
          return;
        }
        this.formation = formation;
        
        // Charger les imports depuis le backend
        this.loadImportsAndShowFile();
      },
      error: err => {
        console.error('Erreur lors du chargement de la formation', err);
        this.router.navigate(['/formations']);
      }
    });
  }

  // Charger les imports et afficher le fichier demandé
  private loadImportsAndShowFile() {
    const qp = this.route.snapshot.queryParamMap;
    this.year = qp.get('year') || '';
    this.level = qp.get('level') || '';
    this.index = Number(qp.get('index') || '0');

    this.svc.listImports(this.id).subscribe({
      next: (imports) => {
        this.importsList = imports || [];
        console.log('Imports chargés dans XLS:', this.importsList);

        // Filtrer par année et niveau
        const filtered = this.importsList.filter(imp => 
          imp.anneeUniversitaire === this.year && 
          imp.niveau === this.level
        );

        this.doc = filtered[this.index] || null;
        if (!this.doc) {
          console.error('Document non trouvé pour', { year: this.year, level: this.level, index: this.index });
          this.router.navigate(['/formations', this.id]);
          return;
        }

        // Télécharger et charger le fichier
        this.downloadAndLoadFile();
      },
      error: err => {
        console.error('Erreur lors du chargement des imports', err);
        this.router.navigate(['/formations', this.id]);
      }
    });
  }

  // Télécharger le fichier depuis le backend et le charger
  private downloadAndLoadFile() {
    if (!this.doc) return;

    console.log('Téléchargement du fichier avec ID:', this.doc.id);
    this.svc.downloadImport(this.doc.id).subscribe({
      next: (blob) => {
        console.log('Blob reçu:', {
          size: blob.size,
          type: blob.type,
          name: this.doc.name
        });
        
        // Créer une URL temporaire pour le blob
        const url = URL.createObjectURL(blob);
        console.log('URL blob créée:', url);
        
        this.loadWorkbook(url).then(() => {
          if (this.sheetNames.length) this.loadSheet(this.sheetNames[0]);
          // Nettoyer l'URL temporaire après utilisation
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }).catch(err => {
          console.error('Erreur lors du chargement du workbook:', err);
          this.errorMsg = 'Impossible de lire le fichier Excel';
        });
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
        this.errorMsg = 'Impossible de télécharger le fichier Excel';
        this.loading = false;
      }
    });
  }

  private async loadWorkbook(url: string) {
    try {
      this.loading = true;
      this.errorMsg = '';
      console.log('Chargement du workbook depuis:', url);
      
      // Import dynamique de SheetJS depuis la dépendance locale
      const XLSX = await import('xlsx');
      console.log('SheetJS importé avec succès');
      
      let buf: ArrayBuffer | null = null;
      try {
        // Stratégie 1: fetch direct ArrayBuffer (ok pour http(s) et blob:)
        console.log('Tentative de fetch ArrayBuffer...');
        const resp = await fetch(url);
        console.log('Response status:', resp.status, resp.statusText);
        buf = await resp.arrayBuffer();
        console.log('ArrayBuffer reçu, taille:', buf.byteLength);
      } catch (err) {
        console.error('Erreur fetch ArrayBuffer:', err);
        // Stratégie 2: via Blob + FileReader (fallback)
        console.log('Tentative de fallback Blob + FileReader...');
        const resp = await fetch(url);
        const blob = await resp.blob();
        buf = await blob.arrayBuffer();
        console.log('ArrayBuffer via fallback, taille:', buf.byteLength);
      }
      if (!buf) throw new Error('buffer-empty');
      
      console.log('Parsing du fichier avec SheetJS...');
      const wb = XLSX.read(buf, { type: 'array' });
      console.log('Workbook parsé:', {
        SheetNames: wb.SheetNames,
        SheetCount: wb.SheetNames.length
      });
      
      this.sheetNames = wb.SheetNames || [];
      console.log('Feuilles détectées:', this.sheetNames);
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
    console.log('Chargement de la feuille:', name);
    const XLSX = (this as any)._xlsx;
    const wb = (this as any)._wb;
    if (!XLSX || !wb) {
      console.error('Workbook ou XLSX non disponible');
      return;
    }

    try {
      const ws = wb.Sheets[name];
      if (!ws) {
        console.error('Feuille non trouvée:', name);
        return;
      }

      console.log('Conversion de la feuille en JSON...');
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('Données brutes:', data);

      this.rows = data as any[][];
      console.log('Rows assignées:', this.rows.length, 'lignes');

      // Compter colonnes
      this.colCount = 0;
      for (const r of this.rows) {
        if (r && r.length > this.colCount) this.colCount = r.length;
      }
      console.log('Nombre de colonnes:', this.colCount);

      // Vérifier si l'en-tête a des valeurs
      this.headerHasValues = this.rows.length > 0 && this.rows[0].some((cell: any) => cell != null && cell !== '');
      console.log('Header a des valeurs:', this.headerHasValues);

      this.selectedSheet = name;
      console.log('Feuille chargée avec succès');
    } catch (e: any) {
      console.error('Erreur lors du chargement de la feuille:', e);
      this.errorMsg = 'Erreur lors de la lecture de la feuille: ' + e.message;
    }
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

  // Télécharger le fichier via le backend
  downloadFile() {
    if (!this.doc) return;
    
    this.svc.downloadImport(this.doc.id).subscribe({
      next: (blob) => {
        // Créer une URL temporaire et déclencher le téléchargement
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.doc.name || 'fichier.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Nettoyer l'URL temporaire
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
        alert('Impossible de télécharger le fichier');
      }
    });
  }
}
