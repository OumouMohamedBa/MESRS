export type StatutTexte = 'En vigueur' | 'Abrogé' | 'Projet';
export type PorteeTexte = 'Nationale' | 'MESRS' | 'Régionale';



export interface Texte{
    id: string;
    titre: string;
    typeDocument: string;
    objet: string;
    datePublication: string;
    referenceOfficielle: string;
    portee: string;
    resumeContenu: string;
    statutApplication: string;
    url: string;
}

