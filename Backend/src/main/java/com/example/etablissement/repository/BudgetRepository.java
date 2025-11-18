package com.example.etablissement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.etablissement.model.Budget;

public interface BudgetRepository extends JpaRepository<Budget, String>, BudgetRepositoryCustom {}
