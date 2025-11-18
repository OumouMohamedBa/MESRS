package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Infrastructure;
import com.example.etablissement.service.InfrastructureService;

@RestController
@RequestMapping("/api/infrastructure")
public class InfrastructureController {

    private final InfrastructureService service;

    public InfrastructureController(InfrastructureService service) {
        this.service = service;
    }

    @GetMapping
    public List<Infrastructure> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Infrastructure> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Infrastructure findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Infrastructure create(@RequestBody Infrastructure e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Infrastructure update(@PathVariable String id, @RequestBody Infrastructure e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
