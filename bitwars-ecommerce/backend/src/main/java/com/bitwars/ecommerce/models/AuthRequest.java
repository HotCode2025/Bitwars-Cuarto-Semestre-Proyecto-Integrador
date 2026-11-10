/*
 * Grupo Bitwars
 * Tecnicatura Universitaria en Programación
 * UTN Sede San Rafael Mendoza - Argentina
 * Octubre de 2026
 *
 * Clase: AuthRequest
 * Descripción: DTO para recibir los datos de login y registro desde el frontend.
 */
package com.bitwars.ecommerce.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
    private String nombre;
    private String email;
    private String password;

    // Datos personales y de envío
    private String telefono;
    private String dni;
    private String calle;
    private String numero;
    private String pisoDepto;
    private String localidad;
    private String provincia;
    private String codigoPostal;
}