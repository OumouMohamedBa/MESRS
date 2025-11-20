package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QVisite_Inspection is a Querydsl query type for Visite_Inspection
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QVisite_Inspection extends EntityPathBase<Visite_Inspection> {

    private static final long serialVersionUID = -1215578261L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QVisite_Inspection visite_Inspection = new QVisite_Inspection("visite_Inspection");

    public final StringPath actionsCorrectives = createString("actionsCorrectives");

    public final StringPath constats = createString("constats");

    public final DatePath<java.time.LocalDate> dateVisite = createDate("dateVisite", java.time.LocalDate.class);

    public final QEtablissement etablissement;

    public final StringPath id = createString("id");

    public final StringPath inspecteurs = createString("inspecteurs");

    public final StringPath methodologie = createString("methodologie");

    public final StringPath motif = createString("motif");

    public final StringPath nonConformites = createString("nonConformites");

    public final StringPath rapport = createString("rapport");

    public final StringPath recommandations = createString("recommandations");

    public final StringPath statutSuivi = createString("statutSuivi");

    public final StringPath typeControle = createString("typeControle");

    public QVisite_Inspection(String variable) {
        this(Visite_Inspection.class, forVariable(variable), INITS);
    }

    public QVisite_Inspection(Path<? extends Visite_Inspection> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QVisite_Inspection(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QVisite_Inspection(PathMetadata metadata, PathInits inits) {
        this(Visite_Inspection.class, metadata, inits);
    }

    public QVisite_Inspection(Class<? extends Visite_Inspection> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
    }

}

