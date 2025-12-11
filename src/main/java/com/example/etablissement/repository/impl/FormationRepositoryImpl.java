package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Formation;
import com.example.etablissement.model.QFormation;
import com.example.etablissement.repository.FormationRepositoryCustom;

@Repository
public class FormationRepositoryImpl implements FormationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public FormationRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Formation> search(String q) {
        QFormation e = QFormation.formation;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
