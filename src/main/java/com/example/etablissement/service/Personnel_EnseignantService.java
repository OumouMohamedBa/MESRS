package com.example.etablissement.service;

import com.example.etablissement.repository.InfrastructureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Personnel_Enseignant;
import com.example.etablissement.repository.Personnel_EnseignantRepository;

@Service

public class Personnel_EnseignantService {

    private final Personnel_EnseignantRepository repo;
    public Personnel_EnseignantService(Personnel_EnseignantRepository repo) {
        this.repo = repo;
    }


    public List<Personnel_Enseignant> findAll() { return repo.findAll(); }
    public List<Personnel_Enseignant> search(String q) { return repo.search(q); }
    public Personnel_Enseignant create(Personnel_Enseignant e) { return repo.save(e); }
    public Personnel_Enseignant update(String id, Personnel_Enseignant e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Personnel_Enseignant findById(String id) { return repo.findById(id).orElse(null); }
}
