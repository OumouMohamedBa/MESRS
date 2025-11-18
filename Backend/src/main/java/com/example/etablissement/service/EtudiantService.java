package com.example.etablissement.service;

import com.example.etablissement.repository.EtablissementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Etudiant;
import com.example.etablissement.repository.EtudiantRepository;

@Service

public class EtudiantService {

    private final EtudiantRepository repo;
    public EtudiantService(EtudiantRepository repo) {
        this.repo = repo;
    }

    public List<Etudiant> findAll() { return repo.findAll(); }
    public List<Etudiant> search(String q) { return repo.search(q); }
    public Etudiant create(Etudiant e) { return repo.save(e); }
    public Etudiant update(String id, Etudiant e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Etudiant findById(String id) { return repo.findById(id).orElse(null); }
}
