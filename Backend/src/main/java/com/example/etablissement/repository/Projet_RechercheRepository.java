package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Projet_Recherche;

public interface Projet_RechercheRepository extends JpaRepository<Projet_Recherche, String>, Projet_RechercheRepositoryCustom {}
