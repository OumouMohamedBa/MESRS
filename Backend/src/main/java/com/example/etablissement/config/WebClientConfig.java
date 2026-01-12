package com.example.etablissement.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(WebClientConfig.class);

    @Value("${rag.service.url:http://localhost:8000}")
    private String ragServiceUrl;

    @Value("${rag.service.timeout:360}")
    private int timeoutSeconds;

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        log.info("Configuring WebClient for RAG service at: {} with timeout: {}s", ragServiceUrl, timeoutSeconds);
        
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000)
                .responseTimeout(Duration.ofSeconds(timeoutSeconds))
                .doOnConnected(conn -> {
                    log.debug("Connected to RAG service");
                    conn.addHandlerLast(new ReadTimeoutHandler(timeoutSeconds, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(timeoutSeconds, TimeUnit.SECONDS));
                });

        return builder
                .baseUrl(ragServiceUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
