package com.example.etablissement.model;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "formation_import_etudiants")
public class FormationImportEtudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Formation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id")
    private Formation formation;

    @Column(name = "annee_universitaire")
    private String anneeUniversitaire;

    @Column(name = "niveau")
    private String niveau;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "size")
    private Long size;

    @Column(name = "uploaded_at")
    private Instant uploadedAt;

    // ⚠️ ICI : plus de @Lob -> on laisse Hibernate mapper sur BYTEA
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data")
    private byte[] data;

    // ====== getters / setters ======

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Formation getFormation() { return formation; }
    public void setFormation(Formation formation) { this.formation = formation; }

    public String getAnneeUniversitaire() { return anneeUniversitaire; }
    public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }

    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
}
