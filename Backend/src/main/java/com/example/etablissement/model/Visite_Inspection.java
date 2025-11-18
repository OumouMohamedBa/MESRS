package com.example.etablissement.model;

import javax.persistence.Entity;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Visite_Inspection")
public class Visite_Inspection {

    @Id
    @Column(name = "ID_visite")
    private String id;

    @Column(name = "Date_visite")
    private java.time.LocalDate dateVisite;

    @Column(name = "Motif")
    private String motif;

    @Column(name = "Inspecteurs")
    private String inspecteurs;

    @Column(name = "Type_controle")
    private String typeControle;

    @Column(name = "Methodologie")
    private String methodologie;

    @Column(name = "Constats")
    private String constats;

    @Column(name = "Recommandations")
    private String recommandations;

    @Column(name = "Non_conformites")
    private String nonConformites;

    @Column(name = "Actions_correctives")
    private String actionsCorrectives;

    @Column(name = "Rapport")
    private String rapport;

    @Column(name = "Statut_suivi")
    private String statutSuivi;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public java.time.LocalDate getDateVisite() { return this.dateVisite; }

    public void setDateVisite(java.time.LocalDate dateVisite) { this.dateVisite = dateVisite; }

    public String getMotif() { return this.motif; }

    public void setMotif(String motif) { this.motif = motif; }

    public String getInspecteurs() { return this.inspecteurs; }

    public void setInspecteurs(String inspecteurs) { this.inspecteurs = inspecteurs; }

    public String getTypeControle() { return this.typeControle; }

    public void setTypeControle(String typeControle) { this.typeControle = typeControle; }

    public String getMethodologie() { return this.methodologie; }

    public void setMethodologie(String methodologie) { this.methodologie = methodologie; }

    public String getConstats() { return this.constats; }

    public void setConstats(String constats) { this.constats = constats; }

    public String getRecommandations() { return this.recommandations; }

    public void setRecommandations(String recommandations) { this.recommandations = recommandations; }

    public String getNonConformites() { return this.nonConformites; }

    public void setNonConformites(String nonConformites) { this.nonConformites = nonConformites; }

    public String getActionsCorrectives() { return this.actionsCorrectives; }

    public void setActionsCorrectives(String actionsCorrectives) { this.actionsCorrectives = actionsCorrectives; }

    public String getRapport() { return this.rapport; }

    public void setRapport(String rapport) { this.rapport = rapport; }

    public String getStatutSuivi() { return this.statutSuivi; }

    public void setStatutSuivi(String statutSuivi) { this.statutSuivi = statutSuivi; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
