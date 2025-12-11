package com.example.etablissement.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Texte;

import java.util.List;

public interface TexteRepository extends JpaRepository<Texte, String>, TexteRepositoryCustom {
    long countByStatut(String statut);
    List<Texte> findByEtablissements_Id(String etablissementId);
}
