package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Visite_Inspection;

public interface Visite_InspectionRepository extends JpaRepository<Visite_Inspection, String>, Visite_InspectionRepositoryCustom {}
