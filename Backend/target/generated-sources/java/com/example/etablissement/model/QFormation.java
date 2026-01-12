package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QFormation is a Querydsl query type for Formation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFormation extends EntityPathBase<Formation> {

    private static final long serialVersionUID = 1545217955L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QFormation formation = new QFormation("formation");

    public final DatePath<java.time.LocalDate> dateCreation = createDate("dateCreation", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> dateOuverture = createDate("dateOuverture", java.time.LocalDate.class);

    public final StringPath diplomeDelivre = createString("diplomeDelivre");

    public final StringPath domaine = createString("domaine");

    public final BooleanPath doubleDiplome = createBoolean("doubleDiplome");

    public final StringPath dureeFormation = createString("dureeFormation");

    public final QEtablissement etablissement;

    public final StringPath etatAccreditation = createString("etatAccreditation");

    public final StringPath id = createString("id");

    public final NumberPath<Integer> nombreDiplomesN1 = createNumber("nombreDiplomesN1", Integer.class);

    public final NumberPath<Integer> nombreEnseignants = createNumber("nombreEnseignants", Integer.class);

    public final NumberPath<Integer> nombreInscrits = createNumber("nombreInscrits", Integer.class);

    public final StringPath nomFiliere = createString("nomFiliere");

    public final StringPath revisionsRecentes = createString("revisionsRecentes");

    public QFormation(String variable) {
        this(Formation.class, forVariable(variable), INITS);
    }

    public QFormation(Path<? extends Formation> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QFormation(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QFormation(PathMetadata metadata, PathInits inits) {
        this(Formation.class, metadata, inits);
    }

    public QFormation(Class<? extends Formation> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement")) : null;
    }

}

