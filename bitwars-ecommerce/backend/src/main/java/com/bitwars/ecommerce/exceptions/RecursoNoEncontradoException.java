/*
 * Grupo Bitwars
 * Excepción para recursos que no existen (404).
 */
package com.bitwars.ecommerce.exceptions;

public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}