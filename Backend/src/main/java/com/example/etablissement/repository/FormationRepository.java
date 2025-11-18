package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Formation;

public interface FormationRepository extends JpaRepository<Formation, String>, FormationRepositoryCustom {}
