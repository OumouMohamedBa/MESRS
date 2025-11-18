package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.QEtablissement;
import com.example.etablissement.repository.EtablissementRepositoryCustom;

@Repository
public class EtablissementRepositoryImpl implements EtablissementRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public EtablissementRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Etablissement> search(String q) {
        QEtablissement e = QEtablissement.etablissement;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
