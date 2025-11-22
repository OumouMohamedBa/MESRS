package com.example.etablissement.repository;

import com.example.etablissement.model.FormationImportEtudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormationImportEtudiantsRepository extends JpaRepository<FormationImportEtudiant, Long> {
    List<FormationImportEtudiant> findByFormation_Id(String formationId);
}
