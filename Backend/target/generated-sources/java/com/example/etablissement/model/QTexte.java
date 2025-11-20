package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTexte is a Querydsl query type for Texte
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTexte extends EntityPathBase<Texte> {

    private static final long serialVersionUID = -1104459574L;

    public static final QTexte texte = new QTexte("texte");

    public final DatePath<java.time.LocalDate> datePublication = createDate("datePublication", java.time.LocalDate.class);

    public final StringPath id = createString("id");

    public final StringPath objet = createString("objet");

    public final StringPath portee = createString("portee");

    public final StringPath referenceOfficielle = createString("referenceOfficielle");

    public final StringPath resumeContenu = createString("resumeContenu");

    public final StringPath statutApplication = createString("statutApplication");

    public final StringPath titre = createString("titre");

    public final StringPath typeDocument = createString("typeDocument");

    public final StringPath url = createString("url");

    public QTexte(String variable) {
        super(Texte.class, forVariable(variable));
    }

    public QTexte(Path<? extends Texte> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTexte(PathMetadata metadata) {
        super(Texte.class, metadata);
    }

}

