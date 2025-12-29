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
  urlFichierExcel?: string; // Chemin vers le fichier Excel stocké sur le serveur
  imports?: { [annee: string]: { [niveau: string]: UploadedDoc[] } };
}

// Payload pour le backend (dureeFormation en string)
export interface FormationBackendPayload {
  id?: string; // optionnel, généré côté front pour création
  nomFiliere: string;
  domaine: string;
  diplomeDelivre: string;
  dureeFormation: string; // backend attend string
  dateCreation: string;
  dateOuverture: string;
  etatAccreditation: string;
  nombreEnseignants: number;
  nombreInscrits: number;
  nombreDiplomesN1: number;
  doubleDiplome: boolean;
  revisionsRecentes?: string;
  urlFichierExcel?: string; // Chemin vers le fichier Excel
  etablissementId: string;
}

// Payload pour les mises à jour partielles (incluant imports)
export interface FormationUpdatePayload {
  imports?: { [annee: string]: { [niveau: string]: UploadedDoc[] } };
}

export interface UploadedDoc {
  name: string;
  type: string;
  size: number;
  uploadedAt: string; // ISO datetime
  url?: string; // Object URL for local preview/download (no backend)
}
