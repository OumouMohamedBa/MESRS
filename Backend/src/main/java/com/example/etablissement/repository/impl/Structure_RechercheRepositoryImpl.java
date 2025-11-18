package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Structure_Recherche;
import com.example.etablissement.model.QStructure_Recherche;
import com.example.etablissement.repository.Structure_RechercheRepositoryCustom;

@Repository
public class Structure_RechercheRepositoryImpl implements Structure_RechercheRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Structure_RechercheRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Structure_Recherche> search(String q) {
        QStructure_Recherche e = QStructure_Recherche.structure_Recherche;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
