package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Budget;
import com.example.etablissement.service.BudgetService;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    @GetMapping
    public List<Budget> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Budget> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Budget findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Budget create(@RequestBody Budget e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Budget update(@PathVariable String id, @RequestBody Budget e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
