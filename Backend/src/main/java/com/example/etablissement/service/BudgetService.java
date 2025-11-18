package com.example.etablissement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Budget;
import com.example.etablissement.repository.BudgetRepository;

@Service

public class BudgetService {

    private final BudgetRepository repo;
    public BudgetService(BudgetRepository repo) {
        this.repo = repo;
    }

    public List<Budget> findAll() { return repo.findAll(); }
    public List<Budget> search(String q) { return repo.search(q); }
    public Budget create(Budget e) { return repo.save(e); }
    public Budget update(String id, Budget e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Budget findById(String id) { return repo.findById(id).orElse(null); }
}
