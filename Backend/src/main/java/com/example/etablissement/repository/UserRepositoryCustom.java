package com.example.etablissement.repository;





import com.example.etablissement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepositoryCustom {

    /**
     * Recherche multi-critères des inspecteurs.
     *
     * @param roleCode    code du rôle (ex: 'INSPECTEUR_SIMPLE') (optionnel)
     * @param active      filtre sur active (optionnel)
     * @param validated   filtre sur validated (optionnel)
     * @param keyword     recherche sur username / name / phone (optionnel)
     * @param pageable    pagination
     * @return page de users
     */
    Page<User> searchInspectors(String roleCode,
                                Boolean active,
                                Boolean validated,
                                String keyword,
                                Pageable pageable);
}
