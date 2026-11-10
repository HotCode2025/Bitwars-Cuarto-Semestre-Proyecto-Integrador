package com.bitwars.ecommerce.exceptions;

/**
 * Grupo Bitwars
 * Excepción lanzada cuando se intenta eliminar un producto que tiene
 * pedidos/detalles asociados (violación de FK).
 * Se mapea a HTTP 409 (CONFLICT) en el GlobalExceptionHandler.
 */
public class ProductoConVentasException extends RuntimeException {
    public ProductoConVentasException(String mensaje) {
        super(mensaje);
    }
}