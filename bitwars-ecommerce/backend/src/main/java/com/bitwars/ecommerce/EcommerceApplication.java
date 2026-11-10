/*
 * Grupo Bitwars
 * Tecnicatura Universitaria en Programación
 * UTN Sede San Rafael Mendoza - Argentina
 * Octubre de 2026
 * 
 * Clase: EcommerceApplication
 * Descripción: Clase principal que arranca el servidor de Spring Boot.
 */
package com.bitwars.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity 
@EnableAsync 
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Backend Bitwars levantado correctamente 🚀");
        System.out.println("=================================================");
    }
}