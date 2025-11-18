package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Etudiant;

public interface EtudiantRepository extends JpaRepository<Etudiant, String>, EtudiantRepositoryCustom {}
