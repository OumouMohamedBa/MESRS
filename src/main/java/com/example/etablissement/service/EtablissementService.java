package com.example.etablissement.service;

import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.TexteRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EtablissementService {

    private final EtablissementRepository etabRepo;
    private final TexteRepository texteRepo;

    public EtablissementService(EtablissementRepository etabRepo, TexteRepository texteRepo) {
        this.etabRepo = etabRepo;
        this.texteRepo = texteRepo;
    }

    // ---------- CRUD DE BASE ----------

    public List<Etablissement> findAll() {
        return etabRepo.findAll();
    }

    public List<Etablissement> search(String q) {
        if (q == null || q.isBlank()) {
            return findAll();
        }
        String pattern = "%" + q.toLowerCase() + "%";
        // à adapter si tu as un repo custom, sinon :
        return etabRepo.findByNomContainingIgnoreCaseOrLocalisationContainingIgnoreCase(q, q);
    }

    public Etablissement findById(String id) {
        return etabRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement introuvable : " + id));
    }

    public Etablissement create(Etablissement e) {
        // 🔑 Si l'ID n'est pas fourni, on le génère : E1, E2, E3...
        if (e.getId() == null || e.getId().isBlank()) {
            e.setId(generateNextId());
        }
        return etabRepo.save(e);
    }

    public Etablissement update(String id, Etablissement patch) {
        Etablissement existing = findById(id);

        existing.setNom(patch.getNom());
        existing.setType(patch.getType());
        existing.setStatutJuridique(patch.getStatutJuridique());
        existing.setLocalisation(patch.getLocalisation());
        existing.setDateCreation(patch.getDateCreation());
        existing.setDateOuverture(patch.getDateOuverture());
        existing.setContacts(patch.getContacts());
        existing.setConseilAdministration(patch.getConseilAdministration());
        existing.setConseilScientifique(patch.getConseilScientifique());
        // on ne touche pas aux collections ici (infras, formations, textes...)

        return etabRepo.save(existing);
    }

    public void delete(String id) {
        etabRepo.deleteById(id);
    }

    // ---------- RELATION ETABLISSEMENT <-> TEXTES ----------

    public Etablissement addTexteToEtablissement(String idEtab, String idTexte) {
        Etablissement etab = findById(idEtab);
        Texte texte = texteRepo.findById(idTexte)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + idTexte));

        etab.getTextes().add(texte);
        texte.getEtablissements().add(etab);

        return etabRepo.save(etab);
    }

    public Etablissement removeTexteFromEtablissement(String idEtab, String idTexte) {
        Etablissement etab = findById(idEtab);
        Texte texte = texteRepo.findById(idTexte)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + idTexte));

        etab.getTextes().remove(texte);
        texte.getEtablissements().remove(etab);

        return etabRepo.save(etab);
    }

    public Etablissement setTextesForEtablissement(String idEtab, List<String> texteIds) {
        Etablissement etab = findById(idEtab);

        // on vide l'ancienne liste
        etab.getTextes().clear();

        for (String idTexte : texteIds) {
            Texte texte = texteRepo.findById(idTexte)
                    .orElseThrow(() -> new RuntimeException("Texte introuvable : " + idTexte));
            etab.getTextes().add(texte);
            texte.getEtablissements().add(etab);
        }

        return etabRepo.save(etab);
    }

    // ---------- Génération d’ID de type E1, E2, E3... ----------

    private String generateNextId() {
        List<Etablissement> all = etabRepo.findAll();

        Optional<Integer> maxNumOpt = all.stream()
                .map(Etablissement::getId)
                .filter(id -> id != null && id.matches("^E\\d+$"))
                .map(id -> Integer.parseInt(id.substring(1)))
                .max(Comparator.naturalOrder());

        int nextNum = maxNumOpt.orElse(0) + 1;
        return "E" + nextNum;
    }
}
