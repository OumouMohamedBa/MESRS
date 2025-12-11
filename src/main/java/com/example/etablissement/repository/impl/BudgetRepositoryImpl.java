package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Budget;
import com.example.etablissement.model.QBudget;
import com.example.etablissement.repository.BudgetRepositoryCustom;

@Repository
public class BudgetRepositoryImpl implements BudgetRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public BudgetRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Budget> search(String q) {
        QBudget e = QBudget.budget;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
