package com.myLover.lover.model;

import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;

public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
     /**
     * Configura el broker de mensajes:
     * - Prefijo para enviar mensajes desde el front: "/app"
     * - Broker simple en "/topic" y "/user"
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/user"); 
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * Registra el endpoint SockJS para poder conectar desde el front
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000") 
                .withSockJS();
    }
}
