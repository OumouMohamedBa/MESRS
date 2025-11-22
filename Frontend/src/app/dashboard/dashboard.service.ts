import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TextesStats {
  total: number;
  enVigueur: number;
  abroges: number;
  projet: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/api/texte/stats';

  constructor(private http: HttpClient) {}

  getTextesStats(): Observable<TextesStats> {
    return this.http.get<TextesStats>(`${this.apiUrl}`);
  }

  // (tu peux garder les autres méthodes mock pour l’instant)
}