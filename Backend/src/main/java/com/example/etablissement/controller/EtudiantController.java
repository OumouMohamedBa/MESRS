package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Etudiant;
import com.example.etablissement.service.EtudiantService;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    private final EtudiantService service;

    public EtudiantController(EtudiantService service) {
        this.service = service;
    }

    @GetMapping
    public List<Etudiant> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Etudiant> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Etudiant findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Etudiant create(@RequestBody Etudiant e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Etudiant update(@PathVariable String id, @RequestBody Etudiant e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
