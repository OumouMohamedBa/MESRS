package com.example.etablissement.service;

import com.example.etablissement.repository.TexteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Visite_Inspection;
import com.example.etablissement.repository.Visite_InspectionRepository;

@Service

public class Visite_InspectionService {

    private final Visite_InspectionRepository repo;
    public Visite_InspectionService(Visite_InspectionRepository repo) {
        this.repo = repo;
    }

    public List<Visite_Inspection> findAll() { return repo.findAll(); }
    public List<Visite_Inspection> search(String q) { return repo.search(q); }
    public Visite_Inspection create(Visite_Inspection e) { return repo.save(e); }
    public Visite_Inspection update(String id, Visite_Inspection e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Visite_Inspection findById(String id) { return repo.findById(id).orElse(null); }
}
