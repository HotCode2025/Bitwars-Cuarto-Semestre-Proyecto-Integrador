/*
 * Grupo Bitwars
 * Tecnicatura Universitaria en Programación
 * UTN Sede San Rafael Mendoza - Argentina
 * Octubre de 2026
 * 
 * Clase: Rol
 * Descripción: Define los roles disponibles en el sistema para la autorización.
 */
package com.bitwars.ecommerce.models;

public enum Rol {
    ADMIN,      // Administrador total (carga productos, ve ventas)
    CLIENTE     // Usuario comprador de la tienda
}