package com.example.etablissement.service;

import com.example.etablissement.repository.Projet_RechercheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Structure_Recherche;
import com.example.etablissement.repository.Structure_RechercheRepository;

@Service

public class Structure_RechercheService {

    private final Structure_RechercheRepository repo;
    public Structure_RechercheService(Structure_RechercheRepository repo) {
        this.repo = repo;
    }

    public List<Structure_Recherche> findAll() { return repo.findAll(); }
    public List<Structure_Recherche> search(String q) { return repo.search(q); }
    public Structure_Recherche create(Structure_Recherche e) { return repo.save(e); }
    public Structure_Recherche update(String id, Structure_Recherche e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Structure_Recherche findById(String id) { return repo.findById(id).orElse(null); }
}
