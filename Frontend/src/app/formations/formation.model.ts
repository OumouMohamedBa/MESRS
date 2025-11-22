export interface Formation {
  id: string; // id_formation
  etablissementId: string; // id_etablissement_fk
  dateCreation: string; // ISO yyyy-mm-dd
  dateOuverture: string; // ISO yyyy-mm-dd
  diplomeDelivre: string;
  domaine: string;
  doubleDiplome: boolean;
  dureeFormation: number; // en années ou semestres selon convention
  etatAccreditation: string; // ex: Accréditée, En cours, Expirée
  nomFiliere: string;
  nombreDiplomesN1: number;
  nombreEnseignants: number;
  nombreInscrits: number;
  revisionsRecentes?: string;
  imports?: { [annee: string]: { [niveau: string]: UploadedDoc[] } };
}

export interface UploadedDoc {
  name: string;
  type: string;
  size: number;
  uploadedAt: string; // ISO datetime
  url?: string; // Object URL for local preview/download (no backend)
}
