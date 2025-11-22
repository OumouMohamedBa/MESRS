package com.example.etablissement.repository;

import com.example.etablissement.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, String> {

    // 🔍 Recherche (adapte selon ton besoin)
    @Query("""
        select f from Formation f
        where lower(f.nomFiliere) like lower(concat('%', :q, '%'))
           or lower(f.domaine) like lower(concat('%', :q, '%'))
           or lower(f.diplomeDelivre) like lower(concat('%', :q, '%'))
    """)
    List<Formation> search(@Param("q") String q);

    // 🔗 toutes les formations d'un établissement
    List<Formation> findByEtablissement_Id(String etablissementId);
}
