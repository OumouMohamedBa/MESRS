package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Personnel_Enseignant")
public class Personnel_Enseignant {

    @Id
    @Column(name = "ID_enseignant")
    private String id;

    @Column(name = "ID_etablissement_origine")
    private String idEtablissementOrigine;

    @Column(name = "NNI")
    private String nni;

    @Column(name = "Matricule")
    private String matricule;

    @Column(name = "Nom")
    private String nom;

    @Column(name = "Prenom")
    private String prenom;

    @Column(name = "Genre")
    private String genre;

    @Column(name = "Date_naissance")
    private java.time.LocalDate dateNaissance;

    @Column(name = "Nationalite")
    private String nationalite;

    @Column(name = "Diplome_plus_eleve")
    private String diplomePlusEleve;

    @Column(name = "Pays_diplome")
    private String paysDiplome;

    @Column(name = "Universite")
    private String universite;

    @Column(name = "Annee_recrutement")
    private String anneeRecrutement;

    @Column(name = "Grade_academique")
    private String gradeAcademique;

    @Column(name = "Specialite_formation")
    private String specialiteFormation;

    @Column(name = "Specialite_enseignement")
    private String specialiteEnseignement;

    @Column(name = "Statut")
    private String statut;

    @Column(name = "Situation")
    private String situation;

    @Column(name = "Responsabilite")
    private String responsabilite;

    @Column(name = "decharge")
    private java.math.BigDecimal decharge;

    @Column(name = "Volume_horaire_statutaire")
    private Integer volumeHoraireStatutaire;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getIdEtablissementOrigine() { return this.idEtablissementOrigine; }

    public void setIdEtablissementOrigine(String idEtablissementOrigine) { this.idEtablissementOrigine = idEtablissementOrigine; }

    public String getNni() { return this.nni; }

    public void setNni(String nni) { this.nni = nni; }

    public String getMatricule() { return this.matricule; }

    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getNom() { return this.nom; }

    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return this.prenom; }

    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getGenre() { return this.genre; }

    public void setGenre(String genre) { this.genre = genre; }

    public java.time.LocalDate getDateNaissance() { return this.dateNaissance; }

    public void setDateNaissance(java.time.LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getNationalite() { return this.nationalite; }

    public void setNationalite(String nationalite) { this.nationalite = nationalite; }

    public String getDiplomePlusEleve() { return this.diplomePlusEleve; }

    public void setDiplomePlusEleve(String diplomePlusEleve) { this.diplomePlusEleve = diplomePlusEleve; }

    public String getPaysDiplome() { return this.paysDiplome; }

    public void setPaysDiplome(String paysDiplome) { this.paysDiplome = paysDiplome; }

    public String getUniversite() { return this.universite; }

    public void setUniversite(String universite) { this.universite = universite; }

    public String getAnneeRecrutement() { return this.anneeRecrutement; }

    public void setAnneeRecrutement(String anneeRecrutement) { this.anneeRecrutement = anneeRecrutement; }

    public String getGradeAcademique() { return this.gradeAcademique; }

    public void setGradeAcademique(String gradeAcademique) { this.gradeAcademique = gradeAcademique; }

    public String getSpecialiteFormation() { return this.specialiteFormation; }

    public void setSpecialiteFormation(String specialiteFormation) { this.specialiteFormation = specialiteFormation; }

    public String getSpecialiteEnseignement() { return this.specialiteEnseignement; }

    public void setSpecialiteEnseignement(String specialiteEnseignement) { this.specialiteEnseignement = specialiteEnseignement; }

    public String getStatut() { return this.statut; }

    public void setStatut(String statut) { this.statut = statut; }

    public String getSituation() { return this.situation; }

    public void setSituation(String situation) { this.situation = situation; }

    public String getResponsabilite() { return this.responsabilite; }

    public void setResponsabilite(String responsabilite) { this.responsabilite = responsabilite; }

    public java.math.BigDecimal getDecharge() { return this.decharge; }

    public void setDecharge(java.math.BigDecimal decharge) { this.decharge = decharge; }

    public Integer getVolumeHoraireStatutaire() { return this.volumeHoraireStatutaire; }

    public void setVolumeHoraireStatutaire(Integer volumeHoraireStatutaire) { this.volumeHoraireStatutaire = volumeHoraireStatutaire; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
