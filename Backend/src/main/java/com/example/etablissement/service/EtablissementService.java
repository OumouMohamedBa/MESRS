package com.example.etablissement.service;

import com.example.etablissement.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Etablissement;
import com.example.etablissement.repository.EtablissementRepository;

@Service

public class EtablissementService {

    private final EtablissementRepository repo;
    public EtablissementService(EtablissementRepository repo) {
        this.repo = repo;
    }

    public List<Etablissement> findAll() { return repo.findAll(); }
    public List<Etablissement> search(String q) { return repo.search(q); }
    public Etablissement create(Etablissement e) { return repo.save(e); }
    public Etablissement update(String id, Etablissement e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Etablissement findById(String id) { return repo.findById(id).orElse(null); }
}
