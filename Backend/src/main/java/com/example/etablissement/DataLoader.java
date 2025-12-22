package com.example.etablissement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.etablissement.repository.TexteRepository;
import com.example.etablissement.repository.EtablissementRepository;
import com.example.etablissement.repository.UserRepository;
import com.example.etablissement.repository.RoleRepository;
import com.example.etablissement.model.User;
import com.example.etablissement.model.Role;

@Component
public class DataLoader implements CommandLineRunner {

    private final TexteRepository texteRepository;
    private final EtablissementRepository etablissementRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // *** Constructeur obligatoire ***
    public DataLoader(TexteRepository texteRepository, EtablissementRepository etablissementRepository,
                     UserRepository userRepository, RoleRepository roleRepository) {
        this.texteRepository = texteRepository;
        this.etablissementRepository = etablissementRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Créer un rôle par défaut s'il n'existe pas
        Role inspecteurRole = roleRepository.findByCode("INSPECTEUR_GENERAL")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setCode("INSPECTEUR_GENERAL");
                    role.setLabel("Inspecteur Général");
                    return roleRepository.save(role);
                });

        // Créer un utilisateur de test s'il n'existe pas
        if (!userRepository.findByUsername("admin").isPresent()) {
            User testUser = new User();
            testUser.setUsername("admin");
            testUser.setName("Admin Test");
            testUser.setPassword("admin123");
            testUser.setPhone("123456789");
            testUser.setRole(inspecteurRole);
            testUser.setActive(true);
            testUser.setValidated(true);
            userRepository.save(testUser);
            System.out.println("Utilisateur de test créé: admin/admin123");
        }

        System.out.println("DataLoader démarré.");
    }
}
