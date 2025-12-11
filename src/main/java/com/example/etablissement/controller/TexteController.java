package com.example.etablissement.controller;

import com.example.etablissement.dot.TextesStatsDTO;
import com.example.etablissement.model.Texte;
import com.example.etablissement.service.TexteService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/texte")
@CrossOrigin(origins = "http://localhost:4200") // adapte si besoin (domaine prod)
public class TexteController {

    private final TexteService service;


    public TexteController(TexteService service) {
        this.service = service;
    }



    @GetMapping
    public List<Texte> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Texte> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Texte findById(@PathVariable String id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // ---------- RELATION TEXTE <-> ETABLISSEMENTS ----------

    @PostMapping("/{idTexte}/etablissements")
    public Texte addEtablissementsToTexte(@PathVariable String idTexte,
                                          @RequestBody List<String> etabIds) {
        return service.addEtablissementsToTexte(idTexte, etabIds);
    }
    @GetMapping("/by-etablissement")
    public List<Texte> getTextesByEtablissement(@RequestParam String etablissementId) {
        return service.findByEtablissement(etablissementId);
    }



    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Texte create(
            @RequestParam("id") String id,
            @RequestParam("titre") String titre,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam(value = "objet", required = false) String objet,
            @RequestParam("datePublication")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datePublication,
            @RequestParam("referenceOfficielle") String referenceOfficielle,
            @RequestParam("portee") String portee,
            @RequestParam(value = "resumeContenu", required = false) String resumeContenu,
            @RequestParam("statutApplication") String statutApplication,
            @RequestPart("file") MultipartFile file
    ) throws Exception {
        return service.createWithFile(
                id, titre, typeDocument, objet,
                datePublication, referenceOfficielle,
                portee, resumeContenu, statutApplication,
                file
        );
    }



    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Texte update(
            @PathVariable String id,
            @RequestParam("titre") String titre,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam(value = "objet", required = false) String objet,
            @RequestParam("datePublication")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datePublication,
            @RequestParam("referenceOfficielle") String referenceOfficielle,
            @RequestParam("portee") String portee,
            @RequestParam(value = "resumeContenu", required = false) String resumeContenu,
            @RequestParam("statutApplication") String statutApplication,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {
        return service.updateWithFile(
                id, titre, typeDocument, objet,
                datePublication, referenceOfficielle,
                portee, resumeContenu, statutApplication,
                file
        );
    }



    @GetMapping("/{id}/fichier")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) {
        Texte t = service.findById(id);
        if (t == null || t.getFichierPdf() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + t.getId() + ".pdf\""
                )
                .body(t.getFichierPdf());
    }
    // Statistiques sur les textes (total, en vigueur, abrogés, projets)
    // Statistiques sur les textes (total, en vigueur, abrogés, projets)
    @GetMapping(value = "/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    public TextesStatsDTO getTextesStats() {
        return service.getTextesStats();
    }

}
