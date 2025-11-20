package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Texte;
import com.example.etablissement.service.TexteService;

@RestController
@RequestMapping("/api/texte")
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

    @PostMapping
    public Texte create(@RequestBody Texte e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Texte update(@PathVariable String id, @RequestBody Texte e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{idTexte}/etablissements")
    public Texte addEtablissementsToTexte(@PathVariable String idTexte,
                                          @RequestBody List<String> etabIds) {
        return service.addEtablissementsToTexte(idTexte, etabIds);
    }

}
