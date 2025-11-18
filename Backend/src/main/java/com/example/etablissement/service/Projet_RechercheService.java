package com.example.etablissement.service;

import com.example.etablissement.repository.Personnel_EnseignantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Projet_Recherche;
import com.example.etablissement.repository.Projet_RechercheRepository;

@Service

public class Projet_RechercheService {

    private final Projet_RechercheRepository repo;
    public Projet_RechercheService(Projet_RechercheRepository repo) {
        this.repo = repo;
    }

    public List<Projet_Recherche> findAll() { return repo.findAll(); }
    public List<Projet_Recherche> search(String q) { return repo.search(q); }
    public Projet_Recherche create(Projet_Recherche e) { return repo.save(e); }
    public Projet_Recherche update(String id, Projet_Recherche e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Projet_Recherche findById(String id) { return repo.findById(id).orElse(null); }
}
