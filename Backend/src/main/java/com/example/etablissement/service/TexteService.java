package com.example.etablissement.service;

import com.example.etablissement.repository.Structure_RechercheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.TexteRepository;

@Service

public class TexteService {

    private final TexteRepository repo;
    public TexteService(TexteRepository repo) {
        this.repo = repo;
    }

    public List<Texte> findAll() { return repo.findAll(); }
    public List<Texte> search(String q) { return repo.search(q); }
    public Texte create(Texte e) { return repo.save(e); }
    public Texte update(String id, Texte e) { e.setId(id); return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
    public Texte findById(String id) { return repo.findById(id).orElse(null); }
}
