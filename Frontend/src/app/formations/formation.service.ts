import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Formation, FormationBackendPayload, FormationUpdatePayload, UploadedDoc } from './formation.model';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private readonly apiUrl = 'http://localhost:8080/api/formation';

  constructor(private http: HttpClient) {}

  // 🔹 Lister toutes les formations
  list(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  // 🔹 Recherche
  search(q: string): Observable<Formation[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<Formation[]>(`${this.apiUrl}/search`, { params });
  }

  // 🔹 Récupérer une formation par ID
  getById(id: string): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Créer une formation
  create(data: FormationBackendPayload): Observable<Formation> {
    // Générer un UUID côté front pour éviter les erreurs 500 du backend
    const payloadWithId = {
      ...data,
      id: crypto.randomUUID() // génère un UUID v4
    };
    console.log('Payload envoyé au backend (avec ID):', payloadWithId);
    return this.http.post<Formation>(this.apiUrl, payloadWithId).pipe(
      catchError(err => {
        console.error('Erreur HTTP détaillée:', err);
        if (err.error) {
          console.error('Body de l’erreur:', err.error);
        }
        return throwError(() => err);
      })
    );
  }

  // 🔹 Mettre à jour une formation (payload complet)
  update(id: string, changes: FormationBackendPayload): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, changes);
  }

  // 🔹 Mettre à jour partiellement une formation (imports uniquement)
  updateImports(id: string, changes: FormationUpdatePayload): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, changes);
  }

  // 🔹 Supprimer une formation
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Upload d'un fichier Excel d'étudiants pour une formation
  uploadExcel(id: string, year: string, level: string, file: File): Observable<UploadedDoc> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('anneeUniversitaire', year);
    formData.append('niveau', level);

    console.log('Upload Excel - FormData:', {
      id,
      year,
      level,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Endpoint correct selon le backend : /api/formation/{id}/etudiants/import
    // Test avec endpoint plus simple si celui-ci ne fonctionne pas
    const testUrl = `${this.apiUrl}/${id}/etudiants/import`;
    console.log('URL appelée:', testUrl);
    
    return this.http.post<UploadedDoc>(testUrl, formData).pipe(
      catchError(err => {
        console.error('Erreur upload Excel:', err);
        if (err.error) {
          console.error('Body erreur upload:', err.error);
        }
        return throwError(() => err);
      })
    );
  }

  // 🔹 Liste des imports pour une formation
  listImports(id: string): Observable<any[]> {
    console.log('Chargement des imports pour la formation:', id);
    return this.http.get<any[]>(`${this.apiUrl}/${id}/etudiants/imports`).pipe(
      catchError(err => {
        console.error('Erreur lors du chargement des imports:', err);
        return [];
      })
    );
  }

  // 🔹 Télécharger un import
  downloadImport(importId: number): Observable<Blob> {
    const url = `${this.apiUrl}/etudiants/imports/${importId}/download`;
    console.log('Téléchargement du fichier depuis:', url);
    
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      catchError(err => {
        console.error('Erreur lors du téléchargement du fichier:', err);
        return throwError(() => err);
      })
    );
  }

  // 🔹 Supprimer un import
  deleteImport(importId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/etudiants/imports/${importId}`);
  }

  // 🔹 Mettre à jour les imports d'une formation (recharge depuis le backend)
  refreshImports(id: string): Observable<any[]> {
    return this.listImports(id);
  }
}
