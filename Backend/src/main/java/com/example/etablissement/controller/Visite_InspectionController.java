package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Visite_Inspection;
import com.example.etablissement.service.Visite_InspectionService;

@RestController
@RequestMapping("/api/visite-inspection")
public class Visite_InspectionController {

    private final Visite_InspectionService service;

    public Visite_InspectionController(Visite_InspectionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Visite_Inspection> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Visite_Inspection> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Visite_Inspection findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Visite_Inspection create(@RequestBody Visite_Inspection e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Visite_Inspection update(@PathVariable String id, @RequestBody Visite_Inspection e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
