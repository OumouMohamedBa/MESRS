package com.example.etablissement.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Texte")
public class Texte {

    @Id
    @Column(name = "ID_texte")
    private String id;

    @Column(name = "Titre")
    private String titre;

    @Column(name = "Type_document")
    private String typeDocument;

    @Column(name = "Objet")
    private String objet;

    @Column(name = "Date_publication")
    private LocalDate datePublication;

    @Column(name = "Reference_officielle")
    private String referenceOfficielle;

    @Column(name = "Portee")
    private String portee;

    @Column(name = "Resume_contenu", length = 2000)
    private String resumeContenu;

    @Column(name = "Statut_application")
    private String statutApplication;

    @Lob
    @Column(name = "Fichier_pdf")
    private byte[] fichierPdf;

    // 🔁 Inverse Many-to-Many avec Etablissement
    @ManyToMany(mappedBy = "textes")
    private Set<Etablissement> etablissements = new HashSet<>();

    // ----- Getters / Setters -----

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public String getTitre() { return this.titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getTypeDocument() { return this.typeDocument; }
    public void setTypeDocument(String typeDocument) { this.typeDocument = typeDocument; }

    public String getObjet() { return this.objet; }
    public void setObjet(String objet) { this.objet = objet; }

    public LocalDate getDatePublication() { return this.datePublication; }
    public void setDatePublication(LocalDate datePublication) { this.datePublication = datePublication; }

    public String getReferenceOfficielle() { return this.referenceOfficielle; }
    public void setReferenceOfficielle(String referenceOfficielle) { this.referenceOfficielle = referenceOfficielle; }

    public String getPortee() { return this.portee; }
    public void setPortee(String portee) { this.portee = portee; }

    public String getResumeContenu() { return this.resumeContenu; }
    public void setResumeContenu(String resumeContenu) { this.resumeContenu = resumeContenu; }

    public String getStatutApplication() { return this.statutApplication; }
    public void setStatutApplication(String statutApplication) { this.statutApplication = statutApplication; }



    public Set<Etablissement> getEtablissements() { return etablissements; }
    public void setEtablissements(Set<Etablissement> etablissements) { this.etablissements = etablissements; }
    public byte[] getFichierPdf() {
        return fichierPdf;
    }

    public void setFichierPdf(byte[] fichierPdf) {
        this.fichierPdf = fichierPdf;
    }
}
