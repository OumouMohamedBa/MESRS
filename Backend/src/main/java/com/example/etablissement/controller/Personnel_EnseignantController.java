package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Personnel_Enseignant;
import com.example.etablissement.service.Personnel_EnseignantService;

@RestController
@RequestMapping("/api/personnel-enseignant")
public class Personnel_EnseignantController {

    private final Personnel_EnseignantService service;

    public Personnel_EnseignantController(Personnel_EnseignantService service) {
        this.service = service;
    }

    @GetMapping
    public List<Personnel_Enseignant> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Personnel_Enseignant> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Personnel_Enseignant findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Personnel_Enseignant create(@RequestBody Personnel_Enseignant e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Personnel_Enseignant update(@PathVariable String id, @RequestBody Personnel_Enseignant e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
