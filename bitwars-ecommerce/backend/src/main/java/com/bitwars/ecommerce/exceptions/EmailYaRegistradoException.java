/*
 * Grupo Bitwars
 * Excepción lanzada cuando se intenta registrar un email que ya existe.
 */
package com.bitwars.ecommerce.exceptions;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String mensaje) {
        super(mensaje);
    }
}