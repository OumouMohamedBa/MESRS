package com.example.etablissement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.etablissement.repository.TexteRepository;
import com.example.etablissement.repository.EtablissementRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final TexteRepository texteRepository;
    private final EtablissementRepository etablissementRepository;

    // *** Constructeur obligatoire ***
    public DataLoader(TexteRepository texteRepository, EtablissementRepository etablissementRepository) {
        this.texteRepository = texteRepository;
        this.etablissementRepository = etablissementRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Si tu veux insérer des données, ajoute ici
        System.out.println("DataLoader démarré.");
    }
}
