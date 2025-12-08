package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QFormationImportEtudiant is a Querydsl query type for FormationImportEtudiant
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFormationImportEtudiant extends EntityPathBase<FormationImportEtudiant> {

    private static final long serialVersionUID = 1786556068L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QFormationImportEtudiant formationImportEtudiant = new QFormationImportEtudiant("formationImportEtudiant");

    public final StringPath anneeUniversitaire = createString("anneeUniversitaire");

    public final StringPath contentType = createString("contentType");

    public final ArrayPath<byte[], Byte> data = createArray("data", byte[].class);

    public final StringPath fileName = createString("fileName");

    public final QFormation formation;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath niveau = createString("niveau");

    public final NumberPath<Long> size = createNumber("size", Long.class);

    public final DateTimePath<java.time.Instant> uploadedAt = createDateTime("uploadedAt", java.time.Instant.class);

    public QFormationImportEtudiant(String variable) {
        this(FormationImportEtudiant.class, forVariable(variable), INITS);
    }

    public QFormationImportEtudiant(Path<? extends FormationImportEtudiant> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QFormationImportEtudiant(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QFormationImportEtudiant(PathMetadata metadata, PathInits inits) {
        this(FormationImportEtudiant.class, metadata, inits);
    }

    public QFormationImportEtudiant(Class<? extends FormationImportEtudiant> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.formation = inits.isInitialized("formation") ? new QFormation(forProperty("formation"), inits.get("formation")) : null;
    }

}

