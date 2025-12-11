package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Infrastructure")
public class Infrastructure {

    @Id
    @Column(name = "ID_infrastructure")
    private String id;

    @Column(name = "Type_infrastructure")
    private String typeInfrastructure;

    @Column(name = "Superficie")
    private java.math.BigDecimal superficie;

    @Column(name = "Capacite_accueil")
    private Integer capaciteAccueil;

    @Column(name = "Conformite_normes")
    private Boolean conformiteNormes;

    @Column(name = "Observations")
    private String observations;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getTypeInfrastructure() { return this.typeInfrastructure; }

    public void setTypeInfrastructure(String typeInfrastructure) { this.typeInfrastructure = typeInfrastructure; }

    public java.math.BigDecimal getSuperficie() { return this.superficie; }

    public void setSuperficie(java.math.BigDecimal superficie) { this.superficie = superficie; }

    public Integer getCapaciteAccueil() { return this.capaciteAccueil; }

    public void setCapaciteAccueil(Integer capaciteAccueil) { this.capaciteAccueil = capaciteAccueil; }

    public Boolean getConformiteNormes() { return this.conformiteNormes; }

    public void setConformiteNormes(Boolean conformiteNormes) { this.conformiteNormes = conformiteNormes; }

    public String getObservations() { return this.observations; }

    public void setObservations(String observations) { this.observations = observations; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
