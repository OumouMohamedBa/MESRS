import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Formation } from './formation.model';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private readonly _items$ = new BehaviorSubject<Formation[]>([
    {
      id: 'F1',
      etablissementId: 'E1',
      dateCreation: '2015-10-01',
      dateOuverture: '2016-01-15',
      diplomeDelivre: 'Licence',
      domaine: 'Informatique',
      doubleDiplome: false,
      dureeFormation: 3,
      etatAccreditation: 'Accréditée',
      nomFiliere: 'Informatique Générale',
      nombreDiplomesN1: 120,
      nombreEnseignants: 18,
      nombreInscrits: 450,
      revisionsRecentes: 'Révision programme 2023'
    },
    {
      id: 'F2',
      etablissementId: 'E1',
      dateCreation: '2018-03-05',
      dateOuverture: '2018-10-01',
      diplomeDelivre: 'Master',
      domaine: 'Mathématiques',
      doubleDiplome: true,
      dureeFormation: 2,
      etatAccreditation: 'En cours',
      nomFiliere: 'Data Science',
      nombreDiplomesN1: 45,
      nombreEnseignants: 10,
      nombreInscrits: 120
    },
    {
      id: 'F3',
      etablissementId: 'E2',
      dateCreation: '2012-05-10',
      dateOuverture: '2012-10-01',
      diplomeDelivre: 'Licence',
      domaine: 'Génie Civil',
      doubleDiplome: false,
      dureeFormation: 3,
      etatAccreditation: 'Accréditée',
      nomFiliere: 'Travaux Publics',
      nombreDiplomesN1: 80,
      nombreEnseignants: 12,
      nombreInscrits: 300
    }
  ]);

  get items$() { return this._items$.asObservable(); }
  get snapshot() { return this._items$.value; }

  list() { return this.items$; }
  getById(id: string) { return this.snapshot.find(f => f.id === id) || null; }

  create(data: Omit<Formation, 'id'>) {
    const numeric = this.snapshot
      .map(f => parseInt(f.id.replace(/^F/, ''), 10))
      .filter(n => !isNaN(n));
    const next = Math.max(0, ...numeric) + 1;
    const id = `F${next}`;
    this._items$.next([...this.snapshot, { id, ...data }]);
  }

  update(id: string, changes: Partial<Formation>) {
    const formations = this._items$.value;
    const index = formations.findIndex(f => f.id === id);
    if (index > -1) {
      const updated = { ...formations[index], ...changes };
      formations[index] = updated;
      this._items$.next([...formations]);
      return of(updated);
    }
    return of(null);
  }
  // In formation.service.ts
uploadExcel(id: string, year: string, level: string, file: File) {
  return of({
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    uploadedAt: new Date().toISOString(),
    url: URL.createObjectURL(file)
  });
}

  delete(id: string) {
    this._items$.next(this.snapshot.filter(f => f.id !== id));
  }

  getByEtablissement(etablissementId: string) {
    return this.snapshot.filter(f => f.etablissementId === etablissementId);
  }
}
