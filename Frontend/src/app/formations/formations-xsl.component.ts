import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormationService } from './formation.service';
import { Formation } from './formation.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-formations-xsl',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './formations-xsl.component.html',
  styleUrls: ['./formations-xsl.component.css']
})
export class FormationsXslComponent implements OnInit {
  formation: Formation | null = null;
  id!: string;
  year = '';
  level = '';
  index = 0;
  doc: any = null;
  isFullscreen = false;
  loading = false;
  errorMsg = '';
  importsList: any[] = [];
  hasCorsError = false;
  iframeViewerUrl: SafeResourceUrl | null = null;
  alternativeViewerUrl: SafeResourceUrl | null = null;

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
        console.log('Imports chargés dans XSL:', this.importsList);

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

        // Charger l'URL du viewer iframe directement
        this.loadViewerUrl();
      },
      error: err => {
        console.error('Erreur lors du chargement des imports', err);
        this.router.navigate(['/formations', this.id]);
      }
    });
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
        a.download = this.doc.name || 'fichier.xsl';
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

  // Obtenir l'URL pour le viewer iframe - EXACTEMENT comme Excel
  getIframeViewerUrl(): SafeResourceUrl {
    if (!this.doc) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    // Approche 1: Essayer Google Docs Viewer avec URL directe (EXACTEMENT comme Excel)
    const fileUrl = `${environment.apiUrl}/api/formation/etudiants/imports/${this.doc.id}/download`;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    
    console.log('Tentative avec Google Docs Viewer:', googleViewerUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
  }

  // Alternative: Convertir en HTML et embed directement - EXACTEMENT comme Excel
  async getAlternativeViewerUrl(): Promise<SafeResourceUrl> {
    if (!this.doc) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    try {
      // Télécharger le fichier - EXACTEMENT comme Excel
      const blob = await firstValueFrom(this.svc.downloadImport(this.doc.id));
      
      if (!blob) {
        throw new Error('Blob non reçu');
      }
      
      // Pour XSL, lire le contenu texte et créer une table HTML similaire à Excel
      const text = await blob.text();
      
      // Parser le XML/XSL et créer une table HTML (même structure que Excel)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      // Créer une table HTML à partir du XML (même style que Excel)
      let htmlTable = '<table>';
      
      // Si c'est un fichier XML/XSL valide, créer des lignes de tableau
      if (xmlDoc.documentElement) {
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
        
        htmlTable += processNode(xmlDoc.documentElement);
      } else {
        // Si ce n'est pas du XML valide, afficher le texte brut dans une table
        const lines = text.split('\n');
        lines.forEach((line, idx) => {
          htmlTable += `<tr><td>${idx + 1}</td><td>${this.escapeHtml(line)}</td></tr>`;
        });
      }
      
      htmlTable += '</table>';
      
      // Créer un data URL avec le HTML - EXACTEMENT comme Excel
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
              min-height: 100vh;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
              color: white;
              padding: 20px;
              text-align: center;
            }
            .header h2 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .header .subtitle {
              opacity: 0.9;
              font-size: 14px;
            }
            .table-container {
              padding: 20px;
              overflow-x: auto;
            }
            table { 
              border-collapse: separate; 
              border-spacing: 0; 
              width: 100%; 
              background: white;
              border: 1px solid #e0e0e0;
            }
            th { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border: 1px solid #dee2e6;
              padding: 12px 8px; 
              text-align: left; 
              font-weight: 600;
              color: #495057;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td { 
              border: 1px solid #e9ecef;
              padding: 10px 8px; 
              text-align: left;
              font-size: 14px;
              color: #212529;
              background: white;
            }
            tr:nth-child(even) td {
              background: #f8f9fa;
            }
            tr:hover td {
              background: #e3f2fd !important;
              transition: background-color 0.2s ease;
            }
            .excel-icon {
              display: inline-block;
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #217346 0%, #1e7e34 100%);
              color: white;
              text-align: center;
              line-height: 32px;
              border-radius: 4px;
              margin-right: 10px;
              font-weight: bold;
            }
            @media (max-width: 768px) {
              .container { margin: 10px; }
              .table-container { padding: 10px; }
              th, td { padding: 8px 6px; font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="display: flex; align-items: center; justify-content: center;">
                <div class="excel-icon">X</div>
                <div>
                  <h2>${this.doc.name}</h2>
                  <div class="subtitle">Visualisation Excel • ${new Date().toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            </div>
            <div class="table-container">
              ${htmlTable}
            </div>
          </div>
        </body>
        </html>
      `;
      
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
      
    } catch (error) {
      console.error('Erreur conversion HTML:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
  }

  // Échapper le HTML pour l'affichage sécurisé
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Charger l'URL du viewer - EXACTEMENT comme Excel
  async loadViewerUrl() {
    if (this.doc) {
      this.loading = true;
      this.hasCorsError = false;
      
      try {
        // Essayer Google Docs Viewer d'abord (EXACTEMENT comme Excel)
        this.iframeViewerUrl = this.getIframeViewerUrl();
        
        // Si ça échoue après 3 secondes, essayer l'alternative HTML (EXACTEMENT comme Excel)
        setTimeout(async () => {
          if (!this.hasCorsError) {
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
}

