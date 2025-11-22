package com.example.etablissement.service;

import com.example.etablissement.dot.TextesStatsDTO;
import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.TexteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TexteService {

    private final TexteRepository texteRepo;
    private final EtablissementRepository etabRepo;

    public TexteService(TexteRepository texteRepo, EtablissementRepository etabRepo) {
        this.texteRepo = texteRepo;
        this.etabRepo = etabRepo;
    }

    // ---------- CRUD DE BASE (SANS FICHIER) ----------

    public List<Texte> findAll() {
        return texteRepo.findAll();
    }

    public List<Texte> search(String q) {
        return texteRepo.search(q);
    }

    public Texte findById(String id) {
        return texteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Texte introuvable : " + id));
    }

    public void delete(String id) {
        texteRepo.deleteById(id);
    }

    // ---------- CREATE / UPDATE AVEC FICHIER PDF ----------

    public Texte createWithFile(
            String id,
            String titre,
            String typeDocument,
            String objet,
            LocalDate datePublication,
            String referenceOfficielle,
            String portee,
            String resumeContenu,
            String statutApplication,
            MultipartFile file
    ) throws Exception {

        Texte t = new Texte();
        t.setId(id);
        t.setTitre(titre);
        t.setTypeDocument(typeDocument);
        t.setObjet(objet);
        t.setDatePublication(datePublication);
        t.setReferenceOfficielle(referenceOfficielle);
        t.setPortee(portee);
        t.setResumeContenu(resumeContenu);
        t.setStatutApplication(statutApplication);

        if (file != null && !file.isEmpty()) {
            t.setFichierPdf(file.getBytes());
        }

        return texteRepo.save(t);
    }

    public Texte updateWithFile(
            String id,
            String titre,
            String typeDocument,
            String objet,
            LocalDate datePublication,
            String referenceOfficielle,
            String portee,
            String resumeContenu,
            String statutApplication,
            MultipartFile file
    ) throws Exception {

        Texte t = findById(id);

        t.setTitre(titre);
        t.setTypeDocument(typeDocument);
        t.setObjet(objet);
        t.setDatePublication(datePublication);
        t.setReferenceOfficielle(referenceOfficielle);
        t.setPortee(portee);
        t.setResumeContenu(resumeContenu);
        t.setStatutApplication(statutApplication);

        // 🔁 Ici : si un nouveau fichier est envoyé, on ÉCRASE l'ancien PDF
        if (file != null && !file.isEmpty()) {
            t.setFichierPdf(file.getBytes());
        }

        return texteRepo.save(t);
    }

    // ---------- RELATION TEXTE <-> ETABLISSEMENTS ----------

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
    public TextesStatsDTO getTextesStats() {
        long total     = texteRepo.count();
        long enVigueur = texteRepo.countByStatut("En vigueur");
        long abroges   = texteRepo.countByStatut("Abrogé");
        long projet    = texteRepo.countByStatut("Projet");

        return new TextesStatsDTO(total, enVigueur, abroges, projet);
    }
    public List<Texte> findByEtablissement(String etablissementId) {
        return texteRepo.findByEtablissements_Id(etablissementId);
    }
}
