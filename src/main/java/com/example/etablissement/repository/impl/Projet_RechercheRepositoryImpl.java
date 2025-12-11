package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Projet_Recherche;
import com.example.etablissement.model.QProjet_Recherche;
import com.example.etablissement.repository.Projet_RechercheRepositoryCustom;

@Repository
public class Projet_RechercheRepositoryImpl implements Projet_RechercheRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Projet_RechercheRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Projet_Recherche> search(String q) {
        QProjet_Recherche e = QProjet_Recherche.projet_Recherche;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}
