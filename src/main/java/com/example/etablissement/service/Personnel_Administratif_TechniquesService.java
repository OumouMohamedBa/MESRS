package com.example.etablissement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Personnel_Administratif_Techniques;
import com.example.etablissement.repository.Personnel_Administratif_TechniquesRepository;

@Service

public class Personnel_Administratif_TechniquesService {

    private final Personnel_Administratif_TechniquesRepository repo;
    public Personnel_Administratif_TechniquesService(Personnel_Administratif_TechniquesRepository repo) {
        this.repo = repo;
    }

    public List<Personnel_Administratif_Techniques> findAll() { return repo.findAll(); }
    public List<Personnel_Administratif_Techniques> search(String q) { return repo.search(q); }
    public Personnel_Administratif_Techniques create(Personnel_Administratif_Techniques e) { return repo.save(e); }
    public Personnel_Administratif_Techniques update(String id, Personnel_Administratif_Techniques e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Personnel_Administratif_Techniques findById(String id) { return repo.findById(id).orElse(null); }
}
