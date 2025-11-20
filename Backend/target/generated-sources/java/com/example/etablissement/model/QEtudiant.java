package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QEtudiant is a Querydsl query type for Etudiant
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QEtudiant extends EntityPathBase<Etudiant> {

    private static final long serialVersionUID = 744139818L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QEtudiant etudiant = new QEtudiant("etudiant");

    public final BooleanPath bourse = createBoolean("bourse");

    public final DatePath<java.time.LocalDate> dateNaissance = createDate("dateNaissance", java.time.LocalDate.class);

    public final QEtablissement etablissement;

    public final QFormation formation;

    public final StringPath genre = createString("genre");

    public final StringPath id = createString("id");

    public final StringPath idEtablissementOrigine = createString("idEtablissementOrigine");

    public final StringPath idFormation = createString("idFormation");

    public final BooleanPath loge = createBoolean("loge");

    public final StringPath nationalite = createString("nationalite");

    public final StringPath niveau = createString("niveau");

    public final StringPath nni = createString("nni");

    public final StringPath nom = createString("nom");

    public final NumberPath<Integer> premiereAnneeInscriptionFormation = createNumber("premiereAnneeInscriptionFormation", Integer.class);

    public final NumberPath<Integer> premiereInscriptionL1 = createNumber("premiereInscriptionL1", Integer.class);

    public final StringPath prenom = createString("prenom");

    public final BooleanPath transferer = createBoolean("transferer");

    public QEtudiant(String variable) {
        this(Etudiant.class, forVariable(variable), INITS);
    }

    public QEtudiant(Path<? extends Etudiant> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QEtudiant(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QEtudiant(PathMetadata metadata, PathInits inits) {
        this(Etudiant.class, metadata, inits);
    }

    public QEtudiant(Class<? extends Etudiant> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
        this.formation = inits.isInitialized("formation") ? new QFormation(forProperty("formation"), inits.get("formation")) : null;
    }

}

