package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Personnel_Enseignant;
import com.example.etablissement.model.QPersonnel_Enseignant;
import com.example.etablissement.repository.Personnel_EnseignantRepositoryCustom;

@Repository
public class Personnel_EnseignantRepositoryImpl implements Personnel_EnseignantRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Personnel_EnseignantRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Personnel_Enseignant> search(String q) {
        QPersonnel_Enseignant e = QPersonnel_Enseignant.personnel_Enseignant;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
