package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Infrastructure;
import com.example.etablissement.model.QInfrastructure;
import com.example.etablissement.repository.InfrastructureRepositoryCustom;

@Repository
public class InfrastructureRepositoryImpl implements InfrastructureRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public InfrastructureRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Infrastructure> search(String q) {
        QInfrastructure e = QInfrastructure.infrastructure;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
