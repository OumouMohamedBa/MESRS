package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;

@Entity
@Table(name = "Structure_Recherche")
public class Structure_Recherche {

    @Id
    @Column(name = "ID_structure")
    private String id;

    @Column(name = "Nature_structure")
    private String natureStructure;

    @Column(name = "Responsable")
    private String responsable;

    @Column(name = "Specialite")
    private String specialite;

    @Column(name = "Nombre_membres")
    private Integer nombreMembres;

    @Column(name = "Nombre_doctorants")
    private Integer nombreDoctorants;

    @Column(name = "Statut_accreditation")
    private Boolean statutAccreditation;

    @Column(name = "Partenaires")
    private String partenaires;

    @Column(name = "Projets_en_cours")
    private String projetsEnCours;

    @Column(name = "Publications")
    private String publications;

    @Column(name = "Equipements")
    private String equipements;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getNatureStructure() { return this.natureStructure; }

    public void setNatureStructure(String natureStructure) { this.natureStructure = natureStructure; }

    public String getResponsable() { return this.responsable; }

    public void setResponsable(String responsable) { this.responsable = responsable; }

    public String getSpecialite() { return this.specialite; }

    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public Integer getNombreMembres() { return this.nombreMembres; }

    public void setNombreMembres(Integer nombreMembres) { this.nombreMembres = nombreMembres; }

    public Integer getNombreDoctorants() { return this.nombreDoctorants; }

    public void setNombreDoctorants(Integer nombreDoctorants) { this.nombreDoctorants = nombreDoctorants; }

    public Boolean getStatutAccreditation() { return this.statutAccreditation; }

    public void setStatutAccreditation(Boolean statutAccreditation) { this.statutAccreditation = statutAccreditation; }

    public String getPartenaires() { return this.partenaires; }

    public void setPartenaires(String partenaires) { this.partenaires = partenaires; }

    public String getProjetsEnCours() { return this.projetsEnCours; }

    public void setProjetsEnCours(String projetsEnCours) { this.projetsEnCours = projetsEnCours; }

    public String getPublications() { return this.publications; }

    public void setPublications(String publications) { this.publications = publications; }

    public String getEquipements() { return this.equipements; }

    public void setEquipements(String equipements) { this.equipements = equipements; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
