export interface Etablissement {
  id: string;
  nom: string;
  type: string;
  statutJuridique: string;
  localisation: string;
  dateCreation: string;
  dateOuverture: string;
  telephone: string;
  conseilAdministration: boolean;
  conseilScientifique: boolean;
}
