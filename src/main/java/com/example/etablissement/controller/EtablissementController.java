package com.example.etablissement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.etablissement.model.Etablissement;
import com.example.etablissement.service.EtablissementService;

@RestController
@RequestMapping("/api/etablissements")
public class EtablissementController {

    private final EtablissementService service;

    public EtablissementController(EtablissementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Etablissement> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Etablissement> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Etablissement findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Etablissement create(@RequestBody Etablissement e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Etablissement update(@PathVariable String id, @RequestBody Etablissement e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
    @PostMapping("/{idEtab}/textes/{idTexte}")
    public Etablissement addTexteToEtablissement(@PathVariable String idEtab,
                                                 @PathVariable String idTexte) {
        return service.addTexteToEtablissement(idEtab, idTexte);
    }


    @DeleteMapping("/{idEtab}/textes/{idTexte}")
    public Etablissement removeTexteFromEtablissement(@PathVariable String idEtab,
                                                      @PathVariable String idTexte) {
        return service.removeTexteFromEtablissement(idEtab, idTexte);
    }


    @PutMapping("/{idEtab}/textes")
    public Etablissement setTextesForEtablissement(@PathVariable String idEtab,
                                                   @RequestBody List<String> texteIds) {
        return service.setTextesForEtablissement(idEtab, texteIds);
    }
}
