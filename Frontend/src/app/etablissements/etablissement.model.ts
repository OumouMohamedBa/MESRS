// src/app/etablissements/etablissement.model.ts

export interface Etablissement {
  id: string;
  nom: string;
  type: string;
  statutJuridique: string;
  localisation: string;
  dateCreation: string;     // LocalDate côté backend -> string ISO côté front
  dateOuverture: string;    // idem
  contacts?: string;        // Téléphone / coordonnées (colonne "Contacts" en BDD)
  conseilAdministration: boolean;
  conseilScientifique: boolean;

  // Optionnel : si tu veux récupérer les textes associés
  // textes?: { id: string; titre: string }[];
}
