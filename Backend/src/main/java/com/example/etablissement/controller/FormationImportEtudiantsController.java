package com.example.etablissement.controller;

import com.example.etablissement.model.Formation;
import com.example.etablissement.model.FormationImportEtudiant;
import com.example.etablissement.repository.FormationRepository;
import com.example.etablissement.repository.FormationImportEtudiantsRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/formation")
public class FormationImportEtudiantsController {

    private final FormationRepository formationRepo;
    private final FormationImportEtudiantsRepository importRepo;

    public FormationImportEtudiantsController(FormationRepository formationRepo,
                                              FormationImportEtudiantsRepository importRepo) {
        this.formationRepo = formationRepo;
        this.importRepo = importRepo;
    }

    // 📌 UPLOAD FICHIER EXCEL
    @PostMapping("/{id}/etudiants/import")
    public ResponseEntity<?> upload(@PathVariable String id,
                                    @RequestParam String anneeUniversitaire,
                                    @RequestParam String niveau,
                                    @RequestParam("file") MultipartFile file) throws Exception {

        Formation formation = formationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation introuvable " + id));

        FormationImportEtudiant imp = new FormationImportEtudiant();
        imp.setFormation(formation);
        imp.setAnneeUniversitaire(anneeUniversitaire);
        imp.setNiveau(niveau);
        imp.setFileName(file.getOriginalFilename());
        imp.setContentType(file.getContentType());
        imp.setSize(file.getSize());
        imp.setUploadedAt(Instant.now());
        imp.setData(file.getBytes());

        FormationImportEtudiant saved = importRepo.save(imp);

        Map<String, Object> dto = new HashMap<>();
        dto.put("id", saved.getId());
        dto.put("name", saved.getFileName());
        dto.put("type", saved.getContentType());
        dto.put("size", saved.getSize());
        dto.put("uploadedAt", saved.getUploadedAt().toString());
        dto.put("anneeUniversitaire", saved.getAnneeUniversitaire());
        dto.put("niveau", saved.getNiveau());

        return ResponseEntity.ok(dto);
    }

    // 📌 LISTE DES IMPORTS POUR UNE FORMATION
    @GetMapping("/{id}/etudiants/imports")
    public List<Map<String, Object>> list(@PathVariable String id) {
        List<FormationImportEtudiant> files = importRepo.findByFormation_Id(id);
        List<Map<String, Object>> result = new ArrayList<>();

        for (FormationImportEtudiant f : files) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", f.getId());
            m.put("name", f.getFileName());
            m.put("size", f.getSize());
            m.put("type", f.getContentType());
            m.put("uploadedAt", f.getUploadedAt());
            m.put("anneeUniversitaire", f.getAnneeUniversitaire());
            m.put("niveau", f.getNiveau());
            result.add(m);
        }
        return result;
    }

    // 📌 DOWNLOAD D’UN FICHIER
    @GetMapping("/etudiants/imports/{importId}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long importId) {
        FormationImportEtudiant imp = importRepo.findById(importId)
                .orElseThrow(() -> new RuntimeException("Import introuvable " + importId));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + imp.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(
                        imp.getContentType() != null ? imp.getContentType() : "application/octet-stream"))
                .body(imp.getData());
    }

    // 📌 DELETE D’UN FICHIER
    @DeleteMapping("/etudiants/imports/{importId}")
    public void deleteImport(@PathVariable Long importId) {
        importRepo.deleteById(importId);
    }
}
