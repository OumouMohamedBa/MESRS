package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPersonnel_Administratif_Techniques is a Querydsl query type for Personnel_Administratif_Techniques
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPersonnel_Administratif_Techniques extends EntityPathBase<Personnel_Administratif_Techniques> {

    private static final long serialVersionUID = -1662171096L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPersonnel_Administratif_Techniques personnel_Administratif_Techniques = new QPersonnel_Administratif_Techniques("personnel_Administratif_Techniques");

    public final StringPath anneeEngagement = createString("anneeEngagement");

    public final DatePath<java.time.LocalDate> dateNaissance = createDate("dateNaissance", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> dateRecrutement = createDate("dateRecrutement", java.time.LocalDate.class);

    public final StringPath decision = createString("decision");

    public final StringPath departementOrigine = createString("departementOrigine");

    public final StringPath diplomePlusEleve = createString("diplomePlusEleve");

    public final QEtablissement etablissement;

    public final StringPath fonction = createString("fonction");

    public final StringPath genre = createString("genre");

    public final StringPath grade = createString("grade");

    public final StringPath id = createString("id");

    public final StringPath matricule = createString("matricule");

    public final StringPath nni = createString("nni");

    public final StringPath nom = createString("nom");

    public final StringPath pays = createString("pays");

    public final StringPath prenom = createString("prenom");

    public final StringPath responsabilite = createString("responsabilite");

    public final StringPath specialiteFormation = createString("specialiteFormation");

    public final StringPath statut = createString("statut");

    public QPersonnel_Administratif_Techniques(String variable) {
        this(Personnel_Administratif_Techniques.class, forVariable(variable), INITS);
    }

    public QPersonnel_Administratif_Techniques(Path<? extends Personnel_Administratif_Techniques> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPersonnel_Administratif_Techniques(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPersonnel_Administratif_Techniques(PathMetadata metadata, PathInits inits) {
        this(Personnel_Administratif_Techniques.class, metadata, inits);
    }

    public QPersonnel_Administratif_Techniques(Class<? extends Personnel_Administratif_Techniques> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement")) : null;
    }

}

