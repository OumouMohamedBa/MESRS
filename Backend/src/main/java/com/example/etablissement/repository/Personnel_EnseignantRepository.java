package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Personnel_Enseignant;

public interface Personnel_EnseignantRepository extends JpaRepository<Personnel_Enseignant, String>, Personnel_EnseignantRepositoryCustom {}
