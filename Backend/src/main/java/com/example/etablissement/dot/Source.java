package com.example.etablissement.dot;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Source {

    private String source;
    
    @JsonProperty("content_preview")
    private String contentPreview;
    
    @JsonProperty("relevance_score")
    private double relevanceScore;

    public Source() {}

    public Source(String source, String contentPreview, double relevanceScore) {
        this.source = source;
        this.contentPreview = contentPreview;
        this.relevanceScore = relevanceScore;
    }

    public String getSource() { return source; }
    public String getContentPreview() { return contentPreview; }
    public double getRelevanceScore() { return relevanceScore; }

    public void setSource(String source) { this.source = source; }
    public void setContentPreview(String contentPreview) { this.contentPreview = contentPreview; }
    public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
}
