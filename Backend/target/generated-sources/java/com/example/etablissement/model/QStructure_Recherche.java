package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStructure_Recherche is a Querydsl query type for Structure_Recherche
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStructure_Recherche extends EntityPathBase<Structure_Recherche> {

    private static final long serialVersionUID = -2018438527L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStructure_Recherche structure_Recherche = new QStructure_Recherche("structure_Recherche");

    public final StringPath equipements = createString("equipements");

    public final QEtablissement etablissement;

    public final StringPath id = createString("id");

    public final StringPath natureStructure = createString("natureStructure");

    public final NumberPath<Integer> nombreDoctorants = createNumber("nombreDoctorants", Integer.class);

    public final NumberPath<Integer> nombreMembres = createNumber("nombreMembres", Integer.class);

    public final StringPath partenaires = createString("partenaires");

    public final StringPath projetsEnCours = createString("projetsEnCours");

    public final StringPath publications = createString("publications");

    public final StringPath responsable = createString("responsable");

    public final StringPath specialite = createString("specialite");

    public final BooleanPath statutAccreditation = createBoolean("statutAccreditation");

    public QStructure_Recherche(String variable) {
        this(Structure_Recherche.class, forVariable(variable), INITS);
    }

    public QStructure_Recherche(Path<? extends Structure_Recherche> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStructure_Recherche(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStructure_Recherche(PathMetadata metadata, PathInits inits) {
        this(Structure_Recherche.class, metadata, inits);
    }

    public QStructure_Recherche(Class<? extends Structure_Recherche> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement")) : null;
    }

}

