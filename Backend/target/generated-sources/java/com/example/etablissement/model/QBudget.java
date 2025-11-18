package com.example.etablissement.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBudget is a Querydsl query type for Budget
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBudget extends EntityPathBase<Budget> {

    private static final long serialVersionUID = -379665005L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBudget budget = new QBudget("budget");

    public final StringPath anneeBudgetaire = createString("anneeBudgetaire");

    public final NumberPath<java.math.BigDecimal> autreBudget = createNumber("autreBudget", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> budgetExecuteN1 = createNumber("budgetExecuteN1", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> budgetInitial = createNumber("budgetInitial", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> budgetPrestation = createNumber("budgetPrestation", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> budgetRectificatif = createNumber("budgetRectificatif", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> budgetSubvention = createNumber("budgetSubvention", java.math.BigDecimal.class);

    public final QEtablissement etablissement;

    public final StringPath exerciceBudgetaire = createString("exerciceBudgetaire");

    public final StringPath id = createString("id");

    public final NumberPath<java.math.BigDecimal> montantDepenses = createNumber("montantDepenses", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> montantRecettes = createNumber("montantRecettes", java.math.BigDecimal.class);

    public final BooleanPath planAchatAnnuel = createBoolean("planAchatAnnuel");

    public final StringPath typeDepense = createString("typeDepense");

    public final StringPath typeRecette = createString("typeRecette");

    public QBudget(String variable) {
        this(Budget.class, forVariable(variable), INITS);
    }

    public QBudget(Path<? extends Budget> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBudget(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBudget(PathMetadata metadata, PathInits inits) {
        this(Budget.class, metadata, inits);
    }

    public QBudget(Class<? extends Budget> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.etablissement = inits.isInitialized("etablissement") ? new QEtablissement(forProperty("etablissement"), inits.get("etablissement")) : null;
    }

}

