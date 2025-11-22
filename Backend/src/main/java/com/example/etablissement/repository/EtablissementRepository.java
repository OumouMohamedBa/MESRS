package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Etablissement;

import java.util.List;

public interface EtablissementRepository extends JpaRepository<Etablissement, String>, EtablissementRepositoryCustom {
    List<Etablissement> findByNomContainingIgnoreCaseOrLocalisationContainingIgnoreCase(String q, String q1);
}
