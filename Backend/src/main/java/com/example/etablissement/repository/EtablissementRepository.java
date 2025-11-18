package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Etablissement;

public interface EtablissementRepository extends JpaRepository<Etablissement, String>, EtablissementRepositoryCustom {}
