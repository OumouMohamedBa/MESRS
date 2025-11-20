package com.example.etablissement.service;

import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.TexteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class TexteService {

    private final TexteRepository texteRepo;
    private final EtablissementRepository etabRepo;

    // 🔧 Ajout du constructeur manuel
    public TexteService(TexteRepository texteRepo, EtablissementRepository etabRepo) {
        this.texteRepo = texteRepo;
        this.etabRepo = etabRepo;
    }

    public List<Texte> findAll() {
        return texteRepo.findAll();
    }

    public List<Texte> search(String q) {
        return texteRepo.search(q);
    }

    public Texte create(Texte e) {
        return texteRepo.save(e);
    }

    public Texte update(String id, Texte e) {
        e.setId(id);
        return texteRepo.save(e);
    }

    public void delete(String id) {
        texteRepo.deleteById(id);
    }

    public Texte findById(String id) {
        return texteRepo.findById(id).orElse(null);
    }

    public Texte addEtablissementsToTexte(String texteId, List<String> etabIds) {
        Texte texte = texteRepo.findById(texteId)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + texteId));

        for (String etabId : etabIds) {
            Etablissement etab = etabRepo.findById(etabId)
                    .orElseThrow(() -> new RuntimeException("Etablissement introuvable : " + etabId));

            texte.getEtablissements().add(etab);
            etab.getTextes().add(texte);
        }

        return texteRepo.save(texte);
    }
}
