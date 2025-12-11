package com.example.etablissement.model;

import javax.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Formation")
@JsonIgnoreProperties(ignoreUnknown = true) // ignore les champs en plus (ex: imports)
public class Formation {

    @Id
    @Column(name = "ID_formation")
    private String id;

    @Column(name = "Nom_filiere")
    private String nomFiliere;

    @Column(name = "Domaine")
    private String domaine;

    @Column(name = "Diplome_delivre")
    private String diplomeDelivre;

    // le front envoie une string (ex "3"), c'est ok
    @Column(name = "Duree_formation")
    private String dureeFormation;

    @Column(name = "Date_creation")
    private LocalDate dateCreation;

    @Column(name = "Date_ouverture")
    private LocalDate dateOuverture;

    // le front envoie "Accréditée", "En cours", etc.
    @Column(name = "Etat_accreditation")
    private String etatAccreditation;

    @Column(name = "Nombre_enseignants")
    private Integer nombreEnseignants;

    @Column(name = "Nombre_inscrits")
    private Integer nombreInscrits;

    @Column(name = "Nombre_diplomes_n_1")
    private Integer nombreDiplomesN1;

    @Column(name = "double_diplome")
    private Boolean doubleDiplome;

    @Column(name = "Revisions_recentes")
    private String revisionsRecentes;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    @JsonIgnore
    private Etablissement etablissement;

    // utilisé pour recevoir et envoyer etablissementId avec le front
    @Transient
    private String etablissementId;

    // ====== GETTERS / SETTERS ======

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public String getNomFiliere() { return this.nomFiliere; }
    public void setNomFiliere(String nomFiliere) { this.nomFiliere = nomFiliere; }

    public String getDomaine() { return this.domaine; }
    public void setDomaine(String domaine) { this.domaine = domaine; }

    public String getDiplomeDelivre() { return this.diplomeDelivre; }
    public void setDiplomeDelivre(String diplomeDelivre) { this.diplomeDelivre = diplomeDelivre; }

    public String getDureeFormation() { return this.dureeFormation; }
    public void setDureeFormation(String dureeFormation) { this.dureeFormation = dureeFormation; }

    public LocalDate getDateCreation() { return this.dateCreation; }
    public void setDateCreation(LocalDate dateCreation) { this.dateCreation = dateCreation; }

    public LocalDate getDateOuverture() { return this.dateOuverture; }
    public void setDateOuverture(LocalDate dateOuverture) { this.dateOuverture = dateOuverture; }

    public String getEtatAccreditation() { return this.etatAccreditation; }
    public void setEtatAccreditation(String etatAccreditation) { this.etatAccreditation = etatAccreditation; }

    public Integer getNombreEnseignants() { return this.nombreEnseignants; }
    public void setNombreEnseignants(Integer nombreEnseignants) { this.nombreEnseignants = nombreEnseignants; }

    public Integer getNombreInscrits() { return this.nombreInscrits; }
    public void setNombreInscrits(Integer nombreInscrits) { this.nombreInscrits = nombreInscrits; }

    public Integer getNombreDiplomesN1() { return this.nombreDiplomesN1; }
    public void setNombreDiplomesN1(Integer nombreDiplomesN1) { this.nombreDiplomesN1 = nombreDiplomesN1; }

    public Boolean getDoubleDiplome() { return this.doubleDiplome; }
    public void setDoubleDiplome(Boolean doubleDiplome) { this.doubleDiplome = doubleDiplome; }

    public String getRevisionsRecentes() { return this.revisionsRecentes; }
    public void setRevisionsRecentes(String revisionsRecentes) { this.revisionsRecentes = revisionsRecentes; }

    public Etablissement getEtablissement() { return this.etablissement; }
    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

    // exposé au front
    public String getEtablissementId() {
        return etablissement != null ? etablissement.getId() : etablissementId;
    }

    public void setEtablissementId(String etablissementId) {
        this.etablissementId = etablissementId;
    }
}
