package com.example.etablissement.dot;

public class TextesStatsDTO {

    private long total;
    private long enVigueur;
    private long abroges;
    private long projet;

    public TextesStatsDTO(long total, long enVigueur, long abroges, long projet) {
        this.total = total;
        this.enVigueur = enVigueur;
        this.abroges = abroges;
        this.projet = projet;
    }

    public long getTotal() { return total; }
    public long getEnVigueur() { return enVigueur; }
    public long getAbroges() { return abroges; }
    public long getProjet() { return projet; }

    public void setTotal(long total) { this.total = total; }
    public void setEnVigueur(long enVigueur) { this.enVigueur = enVigueur; }
    public void setAbroges(long abroges) { this.abroges = abroges; }
    public void setProjet(long projet) { this.projet = projet; }
}
