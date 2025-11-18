package com.example.etablissement.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.etablissement.model.Personnel_Administratif_Techniques;
import com.example.etablissement.repository.Personnel_Administratif_TechniquesRepositoryCustom;
import com.example.etablissement.model.QPersonnel_Administratif_Techniques;

@Repository
public class Personnel_Administratif_TechniquesRepositoryImpl implements Personnel_Administratif_TechniquesRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public Personnel_Administratif_TechniquesRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Personnel_Administratif_Techniques> search(String q) {

        QPersonnel_Administratif_Techniques e = QPersonnel_Administratif_Techniques.personnel_Administratif_Techniques;

        return queryFactory
                .selectFrom(e)
                .where(q != null ? e.id.containsIgnoreCase(q) : null)
                .fetch();
    }
}

