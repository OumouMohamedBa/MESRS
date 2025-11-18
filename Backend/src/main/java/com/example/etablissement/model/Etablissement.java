package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Etablissement")
public class Etablissement {

    @Id
    @Column(name = "ID_etablissement")
    private String id;

    @Column(name = "Nom")
    private String nom;

    @Column(name = "Type")
    private String type;

    @Column(name = "Statut_juridique")
    private String statutJuridique;

    @Column(name = "Localisation")
    private String localisation;

    @Column(name = "Date_creation")
    private java.time.LocalDate dateCreation;

    @Column(name = "Date_ouverture")
    private java.time.LocalDate dateOuverture;

    @Column(name = "Contacts")
    private String contacts;

    @Column(name = "Conseil_administration")
    private Boolean conseilAdministration;

    @Column(name = "Conseil_scientifique")
    private Boolean conseilScientifique;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Infrastructure> infrastructures;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Formation> formations;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Personnel_Enseignant> personnel_enseignants;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Personnel_Administratif_Techniques> personnel_administratif_techniquess;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Budget> budgets;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Structure_Recherche> structure_recherches;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Visite_Inspection> visite_inspections;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Etudiant> etudiants;

    @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    private List<Projet_Recherche> projet_recherches;

    @ManyToOne
    @JoinColumn(name = "ID_texte_fk")
    private Texte texte;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getNom() { return this.nom; }

    public void setNom(String nom) { this.nom = nom; }

    public String getType() { return this.type; }

    public void setType(String type) { this.type = type; }

    public String getStatutJuridique() { return this.statutJuridique; }

    public void setStatutJuridique(String statutJuridique) { this.statutJuridique = statutJuridique; }

    public String getLocalisation() { return this.localisation; }

    public void setLocalisation(String localisation) { this.localisation = localisation; }

    public java.time.LocalDate getDateCreation() { return this.dateCreation; }

    public void setDateCreation(java.time.LocalDate dateCreation) { this.dateCreation = dateCreation; }

    public java.time.LocalDate getDateOuverture() { return this.dateOuverture; }

    public void setDateOuverture(java.time.LocalDate dateOuverture) { this.dateOuverture = dateOuverture; }

    public String getContacts() { return this.contacts; }

    public void setContacts(String contacts) { this.contacts = contacts; }

    public Boolean getConseilAdministration() { return this.conseilAdministration; }

    public void setConseilAdministration(Boolean conseilAdministration) { this.conseilAdministration = conseilAdministration; }

    public Boolean getConseilScientifique() { return this.conseilScientifique; }

    public void setConseilScientifique(Boolean conseilScientifique) { this.conseilScientifique = conseilScientifique; }

    public List<Infrastructure> getInfrastructures() { return this.infrastructures; }

    public void setInfrastructures(List<Infrastructure> infrastructures) { this.infrastructures = infrastructures; }

    public List<Formation> getFormations() { return this.formations; }

    public void setFormations(List<Formation> formations) { this.formations = formations; }

    public List<Personnel_Enseignant> getPersonnel_Enseignants() { return this.personnel_enseignants; }

    public void setPersonnel_Enseignants(List<Personnel_Enseignant> personnel_enseignants) { this.personnel_enseignants = personnel_enseignants; }

    public List<Personnel_Administratif_Techniques> getPersonnel_Administratif_Techniquess() { return this.personnel_administratif_techniquess; }

    public void setPersonnel_Administratif_Techniquess(List<Personnel_Administratif_Techniques> personnel_administratif_techniquess) { this.personnel_administratif_techniquess = personnel_administratif_techniquess; }

    public List<Budget> getBudgets() { return this.budgets; }

    public void setBudgets(List<Budget> budgets) { this.budgets = budgets; }

    public List<Structure_Recherche> getStructure_Recherches() { return this.structure_recherches; }

    public void setStructure_Recherches(List<Structure_Recherche> structure_recherches) { this.structure_recherches = structure_recherches; }

    public List<Visite_Inspection> getVisite_Inspections() { return this.visite_inspections; }

    public void setVisite_Inspections(List<Visite_Inspection> visite_inspections) { this.visite_inspections = visite_inspections; }

    public List<Etudiant> getEtudiants() { return this.etudiants; }

    public void setEtudiants(List<Etudiant> etudiants) { this.etudiants = etudiants; }

    public List<Projet_Recherche> getProjet_Recherches() { return this.projet_recherches; }

    public void setProjet_Recherches(List<Projet_Recherche> projet_recherches) { this.projet_recherches = projet_recherches; }

    public Texte getTexte() { return this.texte; }

    public void setTexte(Texte texte) { this.texte = texte; }

}
