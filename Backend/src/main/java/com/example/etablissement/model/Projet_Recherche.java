package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Projet_Recherche")
public class Projet_Recherche {

    @Id
    @Column(name = "ID_projet")
    private String id;

    @Column(name = "ID_structure")
    private String idStructure;

    @Column(name = "Nombre_formations")
    private Integer nombreFormations;

    @Column(name = "Inscrits_master")
    private Integer inscritsMaster;

    @Column(name = "Inscrits_doctorat")
    private Integer inscritsDoctorat;

    @Column(name = "Nombre_projets")
    private Integer nombreProjets;

    @Column(name = "Domaines_recherche")
    private String domainesRecherche;

    @Column(name = "Objectifs")
    private String objectifs;

    @Column(name = "Budget")
    private java.math.BigDecimal budget;

    @Column(name = "Duree")
    private String duree;

    @Column(name = "Source_financement")
    private String sourceFinancement;

    @Column(name = "Responsables")
    private String responsables;

    @Column(name = "Structure_porteuse")
    private String structurePorteuse;

    @Column(name = "Etat_avancement")
    private String etatAvancement;

    @Column(name = "Livrables")
    private String livrables;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    @ManyToOne
    @JoinColumn(name = "ID_structure_fk")
    private Structure_Recherche structureRecherche;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getIdStructure() { return this.idStructure; }

    public void setIdStructure(String idStructure) { this.idStructure = idStructure; }

    public Integer getNombreFormations() { return this.nombreFormations; }

    public void setNombreFormations(Integer nombreFormations) { this.nombreFormations = nombreFormations; }

    public Integer getInscritsMaster() { return this.inscritsMaster; }

    public void setInscritsMaster(Integer inscritsMaster) { this.inscritsMaster = inscritsMaster; }

    public Integer getInscritsDoctorat() { return this.inscritsDoctorat; }

    public void setInscritsDoctorat(Integer inscritsDoctorat) { this.inscritsDoctorat = inscritsDoctorat; }

    public Integer getNombreProjets() { return this.nombreProjets; }

    public void setNombreProjets(Integer nombreProjets) { this.nombreProjets = nombreProjets; }

    public String getDomainesRecherche() { return this.domainesRecherche; }

    public void setDomainesRecherche(String domainesRecherche) { this.domainesRecherche = domainesRecherche; }

    public String getObjectifs() { return this.objectifs; }

    public void setObjectifs(String objectifs) { this.objectifs = objectifs; }

    public java.math.BigDecimal getBudget() { return this.budget; }

    public void setBudget(java.math.BigDecimal budget) { this.budget = budget; }

    public String getDuree() { return this.duree; }

    public void setDuree(String duree) { this.duree = duree; }

    public String getSourceFinancement() { return this.sourceFinancement; }

    public void setSourceFinancement(String sourceFinancement) { this.sourceFinancement = sourceFinancement; }

    public String getResponsables() { return this.responsables; }

    public void setResponsables(String responsables) { this.responsables = responsables; }

    public String getStructurePorteuse() { return this.structurePorteuse; }

    public void setStructurePorteuse(String structurePorteuse) { this.structurePorteuse = structurePorteuse; }

    public String getEtatAvancement() { return this.etatAvancement; }

    public void setEtatAvancement(String etatAvancement) { this.etatAvancement = etatAvancement; }

    public String getLivrables() { return this.livrables; }

    public void setLivrables(String livrables) { this.livrables = livrables; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

    public Structure_Recherche getStructureRecherche() { return this.structureRecherche; }

    public void setStructureRecherche(Structure_Recherche structureRecherche) { this.structureRecherche = structureRecherche; }

}
