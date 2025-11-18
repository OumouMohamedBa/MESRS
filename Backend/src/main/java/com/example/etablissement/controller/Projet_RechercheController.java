package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Projet_Recherche;
import com.example.etablissement.service.Projet_RechercheService;

@RestController
@RequestMapping("/api/projet-recherche")
public class Projet_RechercheController {

    private final Projet_RechercheService service;

    // Constructeur obligatoire (Lombok est désactivé)
    public Projet_RechercheController(Projet_RechercheService service) {
        this.service = service;
    }

    @GetMapping
    public List<Projet_Recherche> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Projet_Recherche> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Projet_Recherche findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Projet_Recherche create(@RequestBody Projet_Recherche e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Projet_Recherche update(@PathVariable String id, @RequestBody Projet_Recherche e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
