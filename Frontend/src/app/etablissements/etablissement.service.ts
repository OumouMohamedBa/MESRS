import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Etablissement } from './etablissement.model';

@Injectable({ providedIn: 'root' })
export class EtablissementService {
  private readonly _etablissements$ = new BehaviorSubject<Etablissement[]>([
    {
      id: 'E1',
      nom: 'Université de Dakar',
      type: 'Université',
      statutJuridique: 'Public',
      localisation: 'Dakar',
      dateCreation: '1957-01-01',
      dateOuverture: '1958-10-01',
      telephone: '+221-33-000-0000',
      conseilAdministration: true,
      conseilScientifique: true
    },
    {
      id: 'E2',
      nom: 'Institut Polytechnique',
      type: 'Institut',
      statutJuridique: 'Public',
      localisation: 'Thiès',
      dateCreation: '1975-03-12',
      dateOuverture: '1976-01-15',
      telephone: '+221-33-111-1111',
      conseilAdministration: true,
      conseilScientifique: false
    },
    {
      id: 'E3',
      nom: 'Université Privée Sahel',
      type: 'Université',
      statutJuridique: 'Privé',
      localisation: 'Saint-Louis',
      dateCreation: '2005-06-20',
      dateOuverture: '2006-10-05',
      telephone: '+221-33-222-2222',
      conseilAdministration: false,
      conseilScientifique: true
    }
  ]);

  get etablissements$() { return this._etablissements$.asObservable(); }
  get snapshot() { return this._etablissements$.value; }

  list() { return this.etablissements$; }
  getById(id: string) { return this.snapshot.find(e => e.id === id) || null; }

  create(data: Omit<Etablissement, 'id'>) {
    const numericParts = this.snapshot
      .map(e => parseInt(e.id.replace(/^E/, ''), 10))
      .filter(n => !isNaN(n));
    const nextNum = Math.max(0, ...numericParts) + 1;
    const nextId = `E${nextNum}`;
    this._etablissements$.next([...this.snapshot, { id: nextId, ...data }]);
  }

  update(id: string, patch: Partial<Etablissement>) {
    this._etablissements$.next(this.snapshot.map(e => e.id === id ? { ...e, ...patch } : e));
  }

  delete(id: string) {
    this._etablissements$.next(this.snapshot.filter(e => e.id !== id));
  }
}
