package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QInfrastructure is a Querydsl query type for Infrastructure
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QInfrastructure extends EntityPathBase<Infrastructure> {

    private static final long serialVersionUID = -1656951311L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QInfrastructure infrastructure = new QInfrastructure("infrastructure");

    public final NumberPath<Integer> capaciteAccueil = createNumber("capaciteAccueil", Integer.class);

    public final BooleanPath conformiteNormes = createBoolean("conformiteNormes");

    public final QEtablissement etablissement;

    public final StringPath id = createString("id");

    public final StringPath observations = createString("observations");

    public final NumberPath<java.math.BigDecimal> superficie = createNumber("superficie", java.math.BigDecimal.class);

    public final StringPath typeInfrastructure = createString("typeInfrastructure");

    public QInfrastructure(String variable) {
        this(Infrastructure.class, forVariable(variable), INITS);
    }

    public QInfrastructure(Path<? extends Infrastructure> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QInfrastructure(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QInfrastructure(PathMetadata metadata, PathInits inits) {
        this(Infrastructure.class, metadata, inits);
    }

    public QInfrastructure(Class<? extends Infrastructure> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
    }

}

