package com.example.etablissement.service;

import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Formation;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.FormationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FormationService {

    private final FormationRepository repo;
    private final EtablissementRepository etabRepo;

    public FormationService(FormationRepository repo,
                            EtablissementRepository etabRepo) {
        this.repo = repo;
        this.etabRepo = etabRepo;
    }

    public List<Formation> findAll() {
        return repo.findAll();
    }

    public List<Formation> search(String q) {
        return repo.search(q);
    }

    public Formation findById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Formation introuvable : " + id));
    }

    public Formation create(Formation f) {
        try {
            // 1️⃣ vérifier id (front génère via crypto.randomUUID)
            if (f.getId() == null || f.getId().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "L'id de la formation est obligatoire");
            }

            // 2️⃣ lier l'établissement via etablissementId
            if (f.getEtablissementId() != null) {
                Etablissement etab = etabRepo.findById(f.getEtablissementId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Etablissement introuvable : " + f.getEtablissementId()));
                f.setEtablissement(etab);
            }

            return repo.save(f);

        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erreur lors de la création de la formation : " + ex.getMessage(),
                    ex);
        }
    }

    public Formation update(String id, Formation f) {
        Formation existing = findById(id);

        existing.setNomFiliere(f.getNomFiliere());
        existing.setDomaine(f.getDomaine());
        existing.setDiplomeDelivre(f.getDiplomeDelivre());
        existing.setDureeFormation(f.getDureeFormation());
        existing.setDateCreation(f.getDateCreation());
        existing.setDateOuverture(f.getDateOuverture());
        existing.setEtatAccreditation(f.getEtatAccreditation());
        existing.setNombreEnseignants(f.getNombreEnseignants());
        existing.setNombreInscrits(f.getNombreInscrits());
        existing.setNombreDiplomesN1(f.getNombreDiplomesN1());
        existing.setDoubleDiplome(f.getDoubleDiplome());
        existing.setRevisionsRecentes(f.getRevisionsRecentes());

        if (f.getEtablissementId() != null) {
            Etablissement etab = etabRepo.findById(f.getEtablissementId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Etablissement introuvable : " + f.getEtablissementId()));
            existing.setEtablissement(etab);
        }

        return repo.save(existing);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public List<Formation> findByEtablissement(String etabId) {
        return repo.findByEtablissement_Id(etabId);
    }
}
