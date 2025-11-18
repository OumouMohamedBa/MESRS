package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Personnel_Administratif_Techniques")
public class Personnel_Administratif_Techniques {

    @Id
    @Column(name = "ID_personnel")
    private String id;

    @Column(name = "Departement_origine")
    private String departementOrigine;

    @Column(name = "NNI")
    private String nni;

    @Column(name = "Matricule")
    private String matricule;

    @Column(name = "Grade")
    private String grade;

    @Column(name = "Nom")
    private String nom;

    @Column(name = "Prenom")
    private String prenom;

    @Column(name = "Genre")
    private String genre;

    @Column(name = "Date_naissance")
    private java.time.LocalDate dateNaissance;

    @Column(name = "Responsabilite")
    private String responsabilite;

    @Column(name = "Fonction")
    private String fonction;

    @Column(name = "Statut")
    private String statut;

    @Column(name = "Date_recrutement")
    private java.time.LocalDate dateRecrutement;

    @Column(name = "Annee_engagement")
    private String anneeEngagement;

    @Column(name = "Diplome_plus_eleve")
    private String diplomePlusEleve;

    @Column(name = "pays")
    private String pays;

    @Column(name = "Specialite_formation")
    private String specialiteFormation;

    @Column(name = "Decision")
    private String decision;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getDepartementOrigine() { return this.departementOrigine; }

    public void setDepartementOrigine(String departementOrigine) { this.departementOrigine = departementOrigine; }

    public String getNni() { return this.nni; }

    public void setNni(String nni) { this.nni = nni; }

    public String getMatricule() { return this.matricule; }

    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getGrade() { return this.grade; }

    public void setGrade(String grade) { this.grade = grade; }

    public String getNom() { return this.nom; }

    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return this.prenom; }

    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getGenre() { return this.genre; }

    public void setGenre(String genre) { this.genre = genre; }

    public java.time.LocalDate getDateNaissance() { return this.dateNaissance; }

    public void setDateNaissance(java.time.LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getResponsabilite() { return this.responsabilite; }

    public void setResponsabilite(String responsabilite) { this.responsabilite = responsabilite; }

    public String getFonction() { return this.fonction; }

    public void setFonction(String fonction) { this.fonction = fonction; }

    public String getStatut() { return this.statut; }

    public void setStatut(String statut) { this.statut = statut; }

    public java.time.LocalDate getDateRecrutement() { return this.dateRecrutement; }

    public void setDateRecrutement(java.time.LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }

    public String getAnneeEngagement() { return this.anneeEngagement; }

    public void setAnneeEngagement(String anneeEngagement) { this.anneeEngagement = anneeEngagement; }

    public String getDiplomePlusEleve() { return this.diplomePlusEleve; }

    public void setDiplomePlusEleve(String diplomePlusEleve) { this.diplomePlusEleve = diplomePlusEleve; }

    public String getPays() { return this.pays; }

    public void setPays(String pays) { this.pays = pays; }

    public String getSpecialiteFormation() { return this.specialiteFormation; }

    public void setSpecialiteFormation(String specialiteFormation) { this.specialiteFormation = specialiteFormation; }

    public String getDecision() { return this.decision; }

    public void setDecision(String decision) { this.decision = decision; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
