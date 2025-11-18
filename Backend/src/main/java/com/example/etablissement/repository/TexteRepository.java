package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Texte;

public interface TexteRepository extends JpaRepository<Texte, String>, TexteRepositoryCustom {}
