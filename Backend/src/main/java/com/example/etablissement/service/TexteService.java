package com.example.etablissement.service;

import com.example.etablissement.dot.IndexRequest;
import com.example.etablissement.dot.IndexResponse;
import com.example.etablissement.dot.TextesStatsDTO;
import com.example.etablissement.model.Etablissement;
import com.example.etablissement.model.Texte;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.TexteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TexteService {

    private static final Logger log = LoggerFactory.getLogger(TexteService.class);

    private final TexteRepository texteRepo;
    private final EtablissementRepository etabRepo;
    private final RagClientService ragClientService;

    // Directory where PDF files will be stored on disk
    @Value("${file.storage.textes:/home/limam/RAG-test-file}")
    private String storageDirectory;

    public TexteService(TexteRepository texteRepo, EtablissementRepository etabRepo, RagClientService ragClientService) {
        this.texteRepo = texteRepo;
        this.etabRepo = etabRepo;
        this.ragClientService = ragClientService;
    }

    @PostConstruct
    public void init() {

        try {
            Files.createDirectories(Paths.get(storageDirectory));
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directory: " + storageDirectory, e);
        }
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
            // Save to database (backup)
            t.setFichierPdf(file.getBytes());
            
            // Save to disk for RAG service
            String filePath = saveFileToDisk(id, file);
            t.setCheminFichier(filePath);
            
            // Index the file in RAG service
            indexFileInRag(filePath);
        }

        return texteRepo.save(t);
    }

    /**
     * Save file to disk and return the absolute path.
     */
    private String saveFileToDisk(String id, MultipartFile file) throws IOException {
        // Sanitize filename to prevent path traversal
        String safeId = id.replaceAll("[^a-zA-Z0-9_-]", "_");
        String fileName = safeId + ".pdf";
        Path filePath = Paths.get(storageDirectory, fileName);
        Files.write(filePath, file.getBytes());
        return filePath.toAbsolutePath().toString();
    }


    private void indexFileInRag(String filePath) {
        try {
            IndexRequest indexRequest = IndexRequest.of(List.of(filePath));
            IndexResponse response = ragClientService.indexDocument(indexRequest);
            
            if (response.isSuccess()) {
                log.info("Successfully indexed file in RAG: {}", filePath);
            } else {
                log.warn("Failed to index file in RAG: {} - {}", filePath, response.getMessage());
            }
        } catch (Exception e) {
            // Don't fail the upload if RAG indexing fails
            log.error("Error indexing file in RAG service: {}", e.getMessage());
        }
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

        // Ici : si un nouveau fichier est envoyé, on ÉCRASE l'ancien PDF
        if (file != null && !file.isEmpty()) {
            // Save to database (backup)
            t.setFichierPdf(file.getBytes());
            
            // Save to disk for RAG service
            String filePath = saveFileToDisk(id, file);
            t.setCheminFichier(filePath);
            
            // Re-index the file in RAG service
            indexFileInRag(filePath);
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
