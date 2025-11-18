package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Personnel_Administratif_Techniques;

public interface Personnel_Administratif_TechniquesRepository extends JpaRepository<Personnel_Administratif_Techniques, String>, Personnel_Administratif_TechniquesRepositoryCustom {}
