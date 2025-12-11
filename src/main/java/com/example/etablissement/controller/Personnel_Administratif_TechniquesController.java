package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Personnel_Administratif_Techniques;
import com.example.etablissement.service.Personnel_Administratif_TechniquesService;

@RestController
@RequestMapping("/api/personnel-administratif-techniques")
public class Personnel_Administratif_TechniquesController {

    private final Personnel_Administratif_TechniquesService service;

    // Constructeur obligatoire (pas de Lombok)
    public Personnel_Administratif_TechniquesController(Personnel_Administratif_TechniquesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Personnel_Administratif_Techniques> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Personnel_Administratif_Techniques> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Personnel_Administratif_Techniques findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Personnel_Administratif_Techniques create(@RequestBody Personnel_Administratif_Techniques e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Personnel_Administratif_Techniques update(@PathVariable String id, @RequestBody Personnel_Administratif_Techniques e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
