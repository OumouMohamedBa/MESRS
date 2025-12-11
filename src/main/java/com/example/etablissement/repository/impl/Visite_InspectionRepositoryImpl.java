package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Visite_Inspection;
import com.example.etablissement.model.QVisite_Inspection;
import com.example.etablissement.repository.Visite_InspectionRepositoryCustom;

@Repository
public class Visite_InspectionRepositoryImpl implements Visite_InspectionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Visite_InspectionRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Visite_Inspection> search(String q) {
        QVisite_Inspection e = QVisite_Inspection.visite_Inspection;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
