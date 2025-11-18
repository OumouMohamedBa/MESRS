export type StatutTexte = 'En vigueur' | 'Abrogé' | 'Projet';
export type PorteeTexte = 'Nationale' | 'MESRS' | 'Régionale';

export interface Texte {
  id: number;
  titre: string;
  type: string; // Loi, Décret, Arrêté...
  reference: string; // ex: 120/2023
  datePublication: string; // ISO date (yyyy-mm-dd)
  statut: StatutTexte;
  portee: PorteeTexte;
  fichierUrl?: string;
}
