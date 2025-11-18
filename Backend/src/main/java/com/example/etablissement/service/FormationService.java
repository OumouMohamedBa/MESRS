package com.example.etablissement.service;

import com.example.etablissement.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Formation;
import com.example.etablissement.repository.FormationRepository;

@Service

public class FormationService {

    private final FormationRepository repo;
    public FormationService(FormationRepository repo) {
        this.repo = repo;
    }

    public List<Formation> findAll() { return repo.findAll(); }
    public List<Formation> search(String q) { return repo.search(q); }
    public Formation create(Formation e) { return repo.save(e); }
    public Formation update(String id, Formation e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Formation findById(String id) { return repo.findById(id).orElse(null); }
}
