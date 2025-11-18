package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Etudiant;
import com.example.etablissement.model.QEtudiant;
import com.example.etablissement.repository.EtudiantRepositoryCustom;

@Repository
public class EtudiantRepositoryImpl implements EtudiantRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public EtudiantRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Etudiant> search(String q) {
        QEtudiant e = QEtudiant.etudiant;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
