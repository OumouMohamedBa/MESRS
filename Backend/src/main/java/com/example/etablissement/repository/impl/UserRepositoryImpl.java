package com.example.etablissement.repository.impl;

import com.example.etablissement.model.QRole;
import com.example.etablissement.model.QUser;
import com.example.etablissement.model.User;
import com.example.etablissement.repository.UserRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;   // ✅ plus de final

    @Override
    public Page<User> searchInspectors(String roleCode,
                                       Boolean active,
                                       Boolean validated,
                                       String keyword,
                                       Pageable pageable) {

        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);

        QUser user = QUser.user;
        QRole role = QRole.role;

        BooleanBuilder predicate = new BooleanBuilder();

        // Filtre sur le rôle (Inspecteur simple / Inspecteur général)
        if (roleCode != null && !roleCode.isBlank()) {
            predicate.and(user.role.code.eq(roleCode));
        }

        // Filtre active
        if (active != null) {
            predicate.and(user.active.eq(active));
        }

        // Filtre validated
        if (validated != null) {
            predicate.and(user.validated.eq(validated));
        }

        // Recherche full-text simple sur username / name / phone
        if (keyword != null && !keyword.isBlank()) {
            String like = "%" + keyword.trim().toLowerCase() + "%";
            predicate.and(
                    user.username.toLowerCase().like(like)
                            .or(user.name.toLowerCase().like(like))
                            .or(user.phone.toLowerCase().like(like))
            );
        }

        // Tri par défaut si aucun sort dans pageable
        Sort sort = pageable.getSort().isSorted()
                ? pageable.getSort()
                : Sort.by(Sort.Direction.ASC, "name");

        // Conversion du Sort Spring vers Querydsl
        com.querydsl.core.types.OrderSpecifier<?>[] orderSpecifiers =
                sort.stream()
                        .map(order -> {
                            if (order.getProperty().equals("name")) {
                                return order.isAscending() ? user.name.asc() : user.name.desc();
                            } else if (order.getProperty().equals("username")) {
                                return order.isAscending() ? user.username.asc() : user.username.desc();
                            }
                            // fallback : tri par id
                            return order.isAscending() ? user.id.asc() : user.id.desc();
                        })
                        .toArray(com.querydsl.core.types.OrderSpecifier[]::new);

        // Requête principale
        List<User> content = queryFactory
                .selectFrom(user)
                .leftJoin(user.role, role).fetchJoin()
                .where(predicate)
                .orderBy(orderSpecifiers)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // Requête de count
        Long total = queryFactory
                .select(user.count())
                .from(user)
                .where(predicate)
                .fetchOne();

        if (total == null) total = 0L;

        return new PageImpl<>(content, pageable, total);
    }
}
