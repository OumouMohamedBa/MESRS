package com.example.etablissement.service;

import com.example.etablissement.repository.FormationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Infrastructure;
import com.example.etablissement.repository.InfrastructureRepository;

@Service

public class InfrastructureService {

    private final InfrastructureRepository repo;
    public InfrastructureService(InfrastructureRepository repo) {
        this.repo = repo;
    }


    public List<Infrastructure> findAll() { return repo.findAll(); }
    public List<Infrastructure> search(String q) { return repo.search(q); }
    public Infrastructure create(Infrastructure e) { return repo.save(e); }
    public Infrastructure update(String id, Infrastructure e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Infrastructure findById(String id) { return repo.findById(id).orElse(null); }
}
