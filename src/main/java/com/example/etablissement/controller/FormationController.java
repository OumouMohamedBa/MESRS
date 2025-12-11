package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Formation;
import com.example.etablissement.service.FormationService;

@RestController
@RequestMapping("/api/formation")
public class FormationController {

    private final FormationService service;

    public FormationController(FormationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Formation> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Formation> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Formation findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Formation create(@RequestBody Formation e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Formation update(@PathVariable String id, @RequestBody Formation e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
