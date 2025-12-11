package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Texte;
import com.example.etablissement.model.QTexte;
import com.example.etablissement.repository.TexteRepositoryCustom;
import com.example.etablissement.repository.TexteRepository;

@Repository
public class TexteRepositoryImpl implements TexteRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public TexteRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Texte> search(String q) {
        QTexte e = QTexte.texte;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }

    public long countByStatut(String statut) {
        QTexte t = QTexte.texte;

        return queryFactory
                .select(t.count())
                .from(t)
                .where(t.statutApplication.equalsIgnoreCase(statut))
                .fetchOne();
    }

}
