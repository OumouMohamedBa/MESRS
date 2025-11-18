package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QProjet_Recherche is a Querydsl query type for Projet_Recherche
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QProjet_Recherche extends EntityPathBase<Projet_Recherche> {

    private static final long serialVersionUID = -562001162L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QProjet_Recherche projet_Recherche = new QProjet_Recherche("projet_Recherche");

    public final NumberPath<java.math.BigDecimal> budget = createNumber("budget", java.math.BigDecimal.class);

    public final StringPath domainesRecherche = createString("domainesRecherche");

    public final StringPath duree = createString("duree");

    public final QEtablissement etablissement;

    public final StringPath etatAvancement = createString("etatAvancement");

    public final StringPath id = createString("id");

    public final StringPath idStructure = createString("idStructure");

    public final NumberPath<Integer> inscritsDoctorat = createNumber("inscritsDoctorat", Integer.class);

    public final NumberPath<Integer> inscritsMaster = createNumber("inscritsMaster", Integer.class);

    public final StringPath livrables = createString("livrables");

    public final NumberPath<Integer> nombreFormations = createNumber("nombreFormations", Integer.class);

    public final NumberPath<Integer> nombreProjets = createNumber("nombreProjets", Integer.class);

    public final StringPath objectifs = createString("objectifs");

    public final StringPath responsables = createString("responsables");

    public final StringPath sourceFinancement = createString("sourceFinancement");

    public final StringPath structurePorteuse = createString("structurePorteuse");

    public final QStructure_Recherche structureRecherche;

    public QProjet_Recherche(String variable) {
        this(Projet_Recherche.class, forVariable(variable), INITS);
    }

    public QProjet_Recherche(Path<? extends Projet_Recherche> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QProjet_Recherche(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QProjet_Recherche(PathMetadata metadata, PathInits inits) {
        this(Projet_Recherche.class, metadata, inits);
    }

    public QProjet_Recherche(Class<? extends Projet_Recherche> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
        this.structureRecherche = inits.isInitialized("structureRecherche") ? new QStructure_Recherche(forProperty("structureRecherche"), inits.get("structureRecherche")) : null;
    }

}

