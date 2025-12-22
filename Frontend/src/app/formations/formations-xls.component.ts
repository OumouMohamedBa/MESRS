import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormationService } from './formation.service';
import { Formation, UploadedDoc } from './formation.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-formations-xls',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './formations-xls.component.html',
  styleUrls: ['./formations-xls.component.css']
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
  viewMode: 'grid' | 'iframe' = 'grid'; // Mode de visualisation
  hasCorsError = false; // Détecter les erreurs CORS
  iframeViewerUrl: SafeResourceUrl | null = null; // URL pour l'iframe
  alternativeViewerUrl: SafeResourceUrl | null = null; // URL alternative HTML

  // Helpers pour le template
  padCount(row: any[]): number { return Math.max(0, this.colCount - ((row && row.length) || 0)); }
  arrayN(n: number): any[] { return Array.from({ length: Math.max(0, Number(n) || 0) }); }
  getCellWidth(index: number): string {
    // Largeur par défaut basée sur l'index pour simuler Excel
    const widths = ['120px', '150px', '180px', '120px', '100px', '100px', '120px', '150px'];
    return widths[index % widths.length] || '120px';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: FormationService,
    private sanitizer: DomSanitizer
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

  // Détecter si le fichier est XSL
  isXslFile(): boolean {
    if (!this.doc || !this.doc.name) return false;
    return /\.(xsl|xslt|XSL|XSLT)$/i.test(this.doc.name);
  }

  // Télécharger le fichier depuis le backend et le charger
  private downloadAndLoadFile() {
    if (!this.doc) return;

    // Pour tous les fichiers (Excel et XSL), utiliser le même comportement
    // Si mode iframe, charger directement le viewer
    if (this.viewMode === 'iframe') {
      this.loadViewerUrl();
      return;
    }

    // Pour le mode grille, essayer de charger le workbook (uniquement pour Excel)
    if (this.isXslFile()) {
      // Pour XSL en mode grille, basculer automatiquement vers iframe
      this.viewMode = 'iframe';
      this.loadViewerUrl();
      return;
    }

    console.log('Téléchargement du fichier avec ID:', this.doc.id);
    console.log('Document complet:', this.doc);
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
        console.log('Response headers:', resp.headers);
        buf = await resp.arrayBuffer();
        console.log('ArrayBuffer reçu, taille:', buf.byteLength);
        
        if (buf.byteLength === 0) {
          throw new Error('Buffer vide');
        }
      } catch (err) {
        console.error('Erreur fetch ArrayBuffer:', err);
        // Stratégie 2: via Blob + FileReader (fallback)
        console.log('Tentative de fallback Blob + FileReader...');
        const resp = await fetch(url);
        const blob = await resp.blob();
        console.log('Blob reçu:', blob.size, blob.type);
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
      console.error('Erreur complète lors du chargement:', e);
      this.errorMsg = 'Impossible de lire le fichier Excel: ' + e.message;
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
      console.log('Données brutes reçues:', data);
      console.log('Nombre de lignes brutes:', data.length);

      this.rows = data as any[][];
      console.log('Rows assignées:', this.rows.length, 'lignes');

      // Compter colonnes
      this.colCount = 0;
      for (const r of this.rows) {
        if (r && r.length > this.colCount) this.colCount = r.length;
      }
      console.log('Nombre de colonnes calculé:', this.colCount);

      // Vérifier si l'en-tête a des valeurs
      this.headerHasValues = this.rows.length > 0 && this.rows[0].some((cell: any) => cell != null && cell !== '');
      console.log('Header a des valeurs:', this.headerHasValues);
      console.log('Première ligne (header):', this.rows[0]);

      this.selectedSheet = name;
      console.log('Feuille chargée avec succès, état final:', {
        rowCount: this.rows.length,
        colCount: this.colCount,
        headerHasValues: this.headerHasValues,
        selectedSheet: this.selectedSheet
      });
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

  // Obtenir l'URL pour le viewer iframe - Microsoft Office Viewer
  getIframeViewerUrl(): SafeResourceUrl {
    if (!this.doc) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    // Utiliser Microsoft Office Online Viewer
    const fileUrl = `${environment.apiUrl}/api/formation/etudiants/imports/${this.doc.id}/download`;
    
    // Microsoft Office Online Viewer pour Excel/XLS
    // Format: https://view.officeapps.live.com/op/embed.aspx?src=URL_DU_FICHIER
    const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    
    console.log('Utilisation de Microsoft Office Viewer:', officeViewerUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(officeViewerUrl);
  }

  // Alternative: Convertir en PDF et embed directement
  async getAlternativeViewerUrl(): Promise<SafeResourceUrl> {
    if (!this.doc) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    try {
      // Télécharger le fichier
      const { firstValueFrom } = await import('rxjs');
      const blob = await firstValueFrom(this.svc.downloadImport(this.doc.id));
      
      if (!blob) {
        throw new Error('Blob non reçu');
      }
      
      // Si c'est un fichier XSL, créer une table HTML à partir du XML
      if (this.isXslFile()) {
        const text = await blob.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        let htmlTable = '<table><thead><tr><th>Élément</th><th>Valeur</th></tr></thead><tbody>';
        
        const processNode = (node: Node, level: number = 0): string => {
          let rows = '';
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as Element;
            const tagName = elem.tagName || 'element';
            const textContent = Array.from(elem.childNodes)
              .filter(n => n.nodeType === Node.TEXT_NODE)
              .map(n => n.textContent?.trim())
              .filter(t => t)
              .join(' ');
            
            rows += `<tr><td style="padding-left: ${level * 20}px;"><strong>${tagName}</strong></td><td>${this.escapeHtml(textContent || '')}</td></tr>`;
            
            Array.from(elem.attributes).forEach(attr => {
              rows += `<tr><td style="padding-left: ${(level + 1) * 20}px; color: #666;">@${attr.name}</td><td>${this.escapeHtml(attr.value)}</td></tr>`;
            });
            
            Array.from(elem.children).forEach(child => {
              rows += processNode(child, level + 1);
            });
          }
          return rows;
        };
        
        if (xmlDoc.documentElement) {
          htmlTable += processNode(xmlDoc.documentElement);
        } else {
          const lines = text.split('\n');
          lines.forEach((line, idx) => {
            htmlTable += `<tr><td>${idx + 1}</td><td>${this.escapeHtml(line)}</td></tr>`;
          });
        }
        
        htmlTable += '</tbody></table>';
        
        // Utiliser le même HTML que pour Excel
        const htmlContent = this.createHtmlViewer(htmlTable);
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
      }
      
      // Pour Excel, utiliser SheetJS
      const XLSX = await import('xlsx');
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Convertir la première feuille en HTML
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const htmlTable = XLSX.utils.sheet_to_html(firstSheet);
      
      // Créer un data URL avec le HTML
      const htmlContent = this.createHtmlViewer(htmlTable);
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
      
    } catch (error) {
      console.error('Erreur conversion HTML:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
  }

  // Charger l'URL du viewer lorsque le mode change
  async loadViewerUrl() {
    if (this.viewMode === 'iframe' && this.doc) {
      this.loading = true;
      this.hasCorsError = false;
      
      try {
        // Essayer Google Docs Viewer d'abord
        this.iframeViewerUrl = this.getIframeViewerUrl();
        
        // Si ça échoue après 3 secondes, essayer l'alternative HTML
        setTimeout(async () => {
          if (this.viewMode === 'iframe' && !this.hasCorsError) {
            console.log('Tentative alternative HTML...');
            this.alternativeViewerUrl = await this.getAlternativeViewerUrl();
            if (this.alternativeViewerUrl) {
              this.iframeViewerUrl = this.alternativeViewerUrl;
            }
          }
        }, 3000);
        
      } catch (error) {
        console.error('Erreur viewer principal, essai alternative:', error);
        this.alternativeViewerUrl = await this.getAlternativeViewerUrl();
        this.iframeViewerUrl = this.alternativeViewerUrl;
      } finally {
        this.loading = false;
      }
    }
  }

  // Convertir un Blob en Data URL
  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Échapper les caractères HTML pour éviter les injections XSS
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Créer un viewer HTML complet avec styles pour afficher le contenu
  private createHtmlViewer(htmlTable: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visualisation du fichier</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: auto;
      max-width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    tr:hover {
      background-color: #f8f9fa;
    }
    td {
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlTable}
  </div>
</body>
</html>`;
  }
}