package com.example.etablissement.model;

import javax.persistence.*;

import javax.persistence.*;
import java.time.*;
import java.math.*;
import java.util.*;



@Entity
@Table(name = "Budget")
public class Budget {

    @Id
    @Column(name = "ID_finance")
    private String id;

    @Column(name = "Annee_budgetaire")
    private String anneeBudgetaire;

    @Column(name = "Exercice_budgetaire")
    private String exerciceBudgetaire;

    @Column(name = "Budget_initial")
    private java.math.BigDecimal budgetInitial;

    @Column(name = "Budget_rectificatif")
    private java.math.BigDecimal budgetRectificatif;

    @Column(name = "Budget_execute_n_1")
    private java.math.BigDecimal budgetExecuteN1;

    @Column(name = "Budget_subvention")
    private java.math.BigDecimal budgetSubvention;

    @Column(name = "Budget_prestation")
    private java.math.BigDecimal budgetPrestation;

    @Column(name = "Autre_budget")
    private java.math.BigDecimal autreBudget;

    @Column(name = "Type_recette")
    private String typeRecette;

    @Column(name = "Montant_recettes")
    private java.math.BigDecimal montantRecettes;

    @Column(name = "Type_depense")
    private String typeDepense;

    @Column(name = "Montant_depenses")
    private java.math.BigDecimal montantDepenses;

    @Column(name = "Plan_achat_annuel")
    private Boolean planAchatAnnuel;

    @ManyToOne
    @JoinColumn(name = "ID_etablissement_fk")
    private Etablissement etablissement;

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public String getAnneeBudgetaire() { return this.anneeBudgetaire; }

    public void setAnneeBudgetaire(String anneeBudgetaire) { this.anneeBudgetaire = anneeBudgetaire; }

    public String getExerciceBudgetaire() { return this.exerciceBudgetaire; }

    public void setExerciceBudgetaire(String exerciceBudgetaire) { this.exerciceBudgetaire = exerciceBudgetaire; }

    public java.math.BigDecimal getBudgetInitial() { return this.budgetInitial; }

    public void setBudgetInitial(java.math.BigDecimal budgetInitial) { this.budgetInitial = budgetInitial; }

    public java.math.BigDecimal getBudgetRectificatif() { return this.budgetRectificatif; }

    public void setBudgetRectificatif(java.math.BigDecimal budgetRectificatif) { this.budgetRectificatif = budgetRectificatif; }

    public java.math.BigDecimal getBudgetExecuteN1() { return this.budgetExecuteN1; }

    public void setBudgetExecuteN1(java.math.BigDecimal budgetExecuteN1) { this.budgetExecuteN1 = budgetExecuteN1; }

    public java.math.BigDecimal getBudgetSubvention() { return this.budgetSubvention; }

    public void setBudgetSubvention(java.math.BigDecimal budgetSubvention) { this.budgetSubvention = budgetSubvention; }

    public java.math.BigDecimal getBudgetPrestation() { return this.budgetPrestation; }

    public void setBudgetPrestation(java.math.BigDecimal budgetPrestation) { this.budgetPrestation = budgetPrestation; }

    public java.math.BigDecimal getAutreBudget() { return this.autreBudget; }

    public void setAutreBudget(java.math.BigDecimal autreBudget) { this.autreBudget = autreBudget; }

    public String getTypeRecette() { return this.typeRecette; }

    public void setTypeRecette(String typeRecette) { this.typeRecette = typeRecette; }

    public java.math.BigDecimal getMontantRecettes() { return this.montantRecettes; }

    public void setMontantRecettes(java.math.BigDecimal montantRecettes) { this.montantRecettes = montantRecettes; }

    public String getTypeDepense() { return this.typeDepense; }

    public void setTypeDepense(String typeDepense) { this.typeDepense = typeDepense; }

    public java.math.BigDecimal getMontantDepenses() { return this.montantDepenses; }

    public void setMontantDepenses(java.math.BigDecimal montantDepenses) { this.montantDepenses = montantDepenses; }

    public Boolean getPlanAchatAnnuel() { return this.planAchatAnnuel; }

    public void setPlanAchatAnnuel(Boolean planAchatAnnuel) { this.planAchatAnnuel = planAchatAnnuel; }

    public Etablissement getEtablissement() { return this.etablissement; }

    public void setEtablissement(Etablissement etablissement) { this.etablissement = etablissement; }

}
