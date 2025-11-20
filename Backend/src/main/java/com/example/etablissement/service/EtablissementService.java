package com.example.etablissement.service;

import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.TexteRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class EtablissementService {

    private final EtablissementRepository repo;
    private final TexteRepository texteRepo;

    // 🔧 Constructeur manuel obligatoire
    public EtablissementService(EtablissementRepository repo, TexteRepository texteRepo) {
        this.repo = repo;
        this.texteRepo = texteRepo;
    }

    public List<Etablissement> findAll() { return repo.findAll(); }

    public List<Etablissement> search(String q) {
        return repo.search(q);
    }

    public Etablissement create(Etablissement e) { return repo.save(e); }

    public Etablissement update(String id, Etablissement e) {
        e.setId(id);
        return repo.save(e);
    }

    public void delete(String id) { repo.deleteById(id); }

    public Etablissement findById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Etablissement non trouvé : " + id));
    }

    public Etablissement addTexteToEtablissement(String etabId, String texteId) {
        Etablissement etab = findById(etabId);
        Texte texte = texteRepo.findById(texteId)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + texteId));

        etab.getTextes().add(texte);
        texte.getEtablissements().add(etab);

        return repo.save(etab);
    }

    public Etablissement removeTexteFromEtablissement(String etabId, String texteId) {
        Etablissement etab = findById(etabId);
        Texte texte = texteRepo.findById(texteId)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + texteId));

        etab.getTextes().remove(texte);
        texte.getEtablissements().remove(etab);

        return repo.save(etab);
    }

    public Etablissement setTextesForEtablissement(String etabId, List<String> texteIds) {
        Etablissement etab = findById(etabId);
        etab.getTextes().clear();

        for (String texteId : texteIds) {
            Texte texte = texteRepo.findById(texteId)
                    .orElseThrow(() -> new RuntimeException("Texte introuvable : " + texteId));
            etab.getTextes().add(texte);
            texte.getEtablissements().add(etab);
        }

        return repo.save(etab);
    }
}
