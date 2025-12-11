package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Structure_Recherche;

public interface Structure_RechercheRepository extends JpaRepository<Structure_Recherche, String>, Structure_RechercheRepositoryCustom {}
