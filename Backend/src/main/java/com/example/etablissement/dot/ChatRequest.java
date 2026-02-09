    package com.example.etablissement.dot;

    import com.fasterxml.jackson.annotation.JsonCreator;
    import com.fasterxml.jackson.annotation.JsonProperty;

    public class ChatRequest {

        private String question;

        @JsonProperty("collection_name")
        private String collectionName = "documents";

        private int k = 4;
        private double threshold = 1.0;
        private String model = "mistral";

        // Default constructor for JSON deserialization
        public ChatRequest() {}

        @JsonCreator
        public ChatRequest(
                @JsonProperty("question") String question,
                @JsonProperty("collection_name") String collectionName,
                @JsonProperty("k") Integer k,
                @JsonProperty("threshold") Double threshold,
                @JsonProperty("model") String model) {
            this.question = question;
            this.collectionName = collectionName != null ? collectionName : "documents";
            this.k = k != null ? k : 4;
            this.threshold = threshold != null ? threshold : 1.0;
            this.model = model != null ? model : "mistral";
        }

        public String getQuestion() { return question; }
        public String getCollectionName() { return collectionName; }
        public int getK() { return k; }
        public double getThreshold() { return threshold; }
        public String getModel() { return model; }

        public void setQuestion(String question) { this.question = question; }
        public void setCollectionName(String collectionName) { this.collectionName = collectionName; }
        public void setK(int k) { this.k = k; }
        public void setThreshold(double threshold) { this.threshold = threshold; }
        public void setModel(String model) { this.model = model; }

        // Static factory method for simple usage
        public static ChatRequest of(String question) {
            return new ChatRequest(question, null, null, null, null);
        }
    }
