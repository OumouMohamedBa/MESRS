package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Structure_Recherche;
import com.example.etablissement.service.Structure_RechercheService;

@RestController
@RequestMapping("/api/structure-recherche")
public class Structure_RechercheController {

    private final Structure_RechercheService service;

    public Structure_RechercheController(Structure_RechercheService service) {
        this.service = service;
    }

    @GetMapping
    public List<Structure_Recherche> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Structure_Recherche> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Structure_Recherche findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Structure_Recherche create(@RequestBody Structure_Recherche e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Structure_Recherche update(@PathVariable String id, @RequestBody Structure_Recherche e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
