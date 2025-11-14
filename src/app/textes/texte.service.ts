import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Texte, PorteeTexte, StatutTexte } from './texte.model';

@Injectable({ providedIn: 'root' })
export class TexteService {
  private readonly _textes$ = new BehaviorSubject<Texte[]>([
    { id: 1, titre: 'Décret 120/2023', type: 'Décret', reference: '120/2023', datePublication: '2023-02-03', statut: 'En vigueur', portee: 'Nationale', fichierUrl: 'assets/pdfs/decret-120-2023.pdf' },
    { id: 2, titre: 'Décret 121/2023', type: 'Décret', reference: '121/2023', datePublication: '2023-02-03', statut: 'En vigueur', portee: 'Nationale' },
    { id: 3, titre: 'Décret 122/2023', type: 'Décret', reference: '122/2023', datePublication: '2023-02-03', statut: 'En vigueur', portee: 'MESRS' },
    { id: 4, titre: 'Décret 123/2023', type: 'Décret', reference: '123/2023', datePublication: '2023-02-03', statut: 'En vigueur', portee: 'MESRS' },
  ]);

  get textes$() { return this._textes$.asObservable(); }
  get snapshot() { return this._textes$.value; }

  list() { return this.textes$; }
  getById(id: number) { return this.snapshot.find(t => t.id === id) || null; }

  create(data: Omit<Texte, 'id'>) {
    const nextId = Math.max(0, ...this.snapshot.map(t => t.id)) + 1;
    this._textes$.next([...this.snapshot, { id: nextId, ...data }]);
  }

  update(id: number, patch: Partial<Texte>) {
    this._textes$.next(this.snapshot.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  delete(id: number) {
    this._textes$.next(this.snapshot.filter(t => t.id !== id));
  }

  search(query: string, statut?: StatutTexte, date?: string) {
    const q = query?.toLowerCase().trim();
    return this.snapshot.filter(t => {
      const matchQ = !q || [t.titre, t.type, t.reference].some(v => v.toLowerCase().includes(q));
      const matchS = !statut || t.statut === statut;
      const matchD = !date || t.datePublication === date;
      return matchQ && matchS && matchD;
    });
  }
}
