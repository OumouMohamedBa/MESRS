package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Infrastructure;

public interface InfrastructureRepository extends JpaRepository<Infrastructure, String>, InfrastructureRepositoryCustom {}
