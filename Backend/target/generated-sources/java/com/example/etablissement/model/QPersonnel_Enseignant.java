package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPersonnel_Enseignant is a Querydsl query type for Personnel_Enseignant
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPersonnel_Enseignant extends EntityPathBase<Personnel_Enseignant> {

    private static final long serialVersionUID = 559703743L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPersonnel_Enseignant personnel_Enseignant = new QPersonnel_Enseignant("personnel_Enseignant");

    public final StringPath anneeRecrutement = createString("anneeRecrutement");

    public final DatePath<java.time.LocalDate> dateNaissance = createDate("dateNaissance", java.time.LocalDate.class);

    public final NumberPath<java.math.BigDecimal> decharge = createNumber("decharge", java.math.BigDecimal.class);

    public final StringPath diplomePlusEleve = createString("diplomePlusEleve");

    public final QEtablissement etablissement;

    public final StringPath genre = createString("genre");

    public final StringPath gradeAcademique = createString("gradeAcademique");

    public final StringPath id = createString("id");

    public final StringPath idEtablissementOrigine = createString("idEtablissementOrigine");

    public final StringPath matricule = createString("matricule");

    public final StringPath nationalite = createString("nationalite");

    public final StringPath nni = createString("nni");

    public final StringPath nom = createString("nom");

    public final StringPath paysDiplome = createString("paysDiplome");

    public final StringPath prenom = createString("prenom");

    public final StringPath responsabilite = createString("responsabilite");

    public final StringPath situation = createString("situation");

    public final StringPath specialiteEnseignement = createString("specialiteEnseignement");

    public final StringPath specialiteFormation = createString("specialiteFormation");

    public final StringPath statut = createString("statut");

    public final StringPath universite = createString("universite");

    public final NumberPath<Integer> volumeHoraireStatutaire = createNumber("volumeHoraireStatutaire", Integer.class);

    public QPersonnel_Enseignant(String variable) {
        this(Personnel_Enseignant.class, forVariable(variable), INITS);
    }

    public QPersonnel_Enseignant(Path<? extends Personnel_Enseignant> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPersonnel_Enseignant(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPersonnel_Enseignant(PathMetadata metadata, PathInits inits) {
        this(Personnel_Enseignant.class, metadata, inits);
    }

    public QPersonnel_Enseignant(Class<? extends Personnel_Enseignant> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
    }

}

