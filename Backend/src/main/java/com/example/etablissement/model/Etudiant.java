package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Etudiant")
public class Etudiant {

    @Id
    @Column(name = "ID_etudiant")
    private String id;

    @Column(name = "ID_formation")
    private String idFormation;

    @Column(name = "NNI")
    private String nni;

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

    @Column(name = "Niveau")
    private String niveau;

    @Column(name = "Premiere_inscription_L1")
    private Integer premiereInscriptionL1;

    @Column(name = "Premiere_annee_inscription_formation")
    private Integer premiereAnneeInscriptionFormation;

    @Column(name = "Transferer")
    private Boolean transferer;

    @Column(name = "ID_etablissement_origine")
    private String idEtablissementOrigine;

    @Column(name = "Bourse")
    private Boolean bourse;

    @Column(name = "Loge")
    private Boolean loge;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    @ManyToOne
    @JoinColumn(name = "ID_formation_fk")
    private Formation formation;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getIdFormation() { return this.idFormation; }

    public void setIdFormation(String idFormation) { this.idFormation = idFormation; }

    public String getNni() { return this.nni; }

    public void setNni(String nni) { this.nni = nni; }

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

    public String getNiveau() { return this.niveau; }

    public void setNiveau(String niveau) { this.niveau = niveau; }

    public Integer getPremiereInscriptionL1() { return this.premiereInscriptionL1; }

    public void setPremiereInscriptionL1(Integer premiereInscriptionL1) { this.premiereInscriptionL1 = premiereInscriptionL1; }

    public Integer getPremiereAnneeInscriptionFormation() { return this.premiereAnneeInscriptionFormation; }

    public void setPremiereAnneeInscriptionFormation(Integer premiereAnneeInscriptionFormation) { this.premiereAnneeInscriptionFormation = premiereAnneeInscriptionFormation; }

    public Boolean getTransferer() { return this.transferer; }

    public void setTransferer(Boolean transferer) { this.transferer = transferer; }

    public String getIdEtablissementOrigine() { return this.idEtablissementOrigine; }

    public void setIdEtablissementOrigine(String idEtablissementOrigine) { this.idEtablissementOrigine = idEtablissementOrigine; }

    public Boolean getBourse() { return this.bourse; }

    public void setBourse(Boolean bourse) { this.bourse = bourse; }

    public Boolean getLoge() { return this.loge; }

    public void setLoge(Boolean loge) { this.loge = loge; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

    public Formation getFormation() { return this.formation; }

    public void setFormation(Formation formation) { this.formation = formation; }

}
