package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QEtablissement is a Querydsl query type for Etablissement
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QEtablissement extends EntityPathBase<Etablissement> {

    private static final long serialVersionUID = -1022434392L;

    public static final QEtablissement etablissement = new QEtablissement("etablissement");

    public final ListPath<Budget, QBudget> budgets = this.<Budget, QBudget>createList("budgets", Budget.class, QBudget.class, PathInits.DIRECT2);

    public final BooleanPath conseilAdministration = createBoolean("conseilAdministration");

    public final BooleanPath conseilScientifique = createBoolean("conseilScientifique");

    public final StringPath contacts = createString("contacts");

    public final DatePath<java.time.LocalDate> dateCreation = createDate("dateCreation", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> dateOuverture = createDate("dateOuverture", java.time.LocalDate.class);

    public final ListPath<Etudiant, QEtudiant> etudiants = this.<Etudiant, QEtudiant>createList("etudiants", Etudiant.class, QEtudiant.class, PathInits.DIRECT2);

    public final ListPath<Formation, QFormation> formations = this.<Formation, QFormation>createList("formations", Formation.class, QFormation.class, PathInits.DIRECT2);

    public final StringPath id = createString("id");

    public final ListPath<Infrastructure, QInfrastructure> infrastructures = this.<Infrastructure, QInfrastructure>createList("infrastructures", Infrastructure.class, QInfrastructure.class, PathInits.DIRECT2);

    public final StringPath localisation = createString("localisation");

    public final StringPath nom = createString("nom");

    public final ListPath<Personnel_Administratif_Techniques, QPersonnel_Administratif_Techniques> personnel_administratif_techniquess = this.<Personnel_Administratif_Techniques, QPersonnel_Administratif_Techniques>createList("personnel_administratif_techniquess", Personnel_Administratif_Techniques.class, QPersonnel_Administratif_Techniques.class, PathInits.DIRECT2);

    public final ListPath<Personnel_Enseignant, QPersonnel_Enseignant> personnel_enseignants = this.<Personnel_Enseignant, QPersonnel_Enseignant>createList("personnel_enseignants", Personnel_Enseignant.class, QPersonnel_Enseignant.class, PathInits.DIRECT2);

    public final ListPath<Projet_Recherche, QProjet_Recherche> projet_recherches = this.<Projet_Recherche, QProjet_Recherche>createList("projet_recherches", Projet_Recherche.class, QProjet_Recherche.class, PathInits.DIRECT2);

    public final StringPath statutJuridique = createString("statutJuridique");

    public final ListPath<Structure_Recherche, QStructure_Recherche> structure_recherches = this.<Structure_Recherche, QStructure_Recherche>createList("structure_recherches", Structure_Recherche.class, QStructure_Recherche.class, PathInits.DIRECT2);

    public final SetPath<Texte, QTexte> textes = this.<Texte, QTexte>createSet("textes", Texte.class, QTexte.class, PathInits.DIRECT2);

    public final StringPath type = createString("type");

    public final ListPath<Visite_Inspection, QVisite_Inspection> visite_inspections = this.<Visite_Inspection, QVisite_Inspection>createList("visite_inspections", Visite_Inspection.class, QVisite_Inspection.class, PathInits.DIRECT2);

    public QEtablissement(String variable) {
        super(Etablissement.class, forVariable(variable));
    }

    public QEtablissement(Path<? extends Etablissement> path) {
        super(path.getType(), path.getMetadata());
    }

    public QEtablissement(PathMetadata metadata) {
        super(Etablissement.class, metadata);
    }

}

