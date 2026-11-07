package com.bitwars.ecommerce.controllers;

import com.bitwars.ecommerce.exceptions.EmailYaRegistradoException;
import com.bitwars.ecommerce.exceptions.ProductoConVentasException;
import com.bitwars.ecommerce.exceptions.RecursoNoEncontradoException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Grupo Bitwars
 * Clase: GlobalExceptionHandler
 *
 * ⚠️ CORRECCIONES APLICADAS:
 * 1) `DataIntegrityViolationException` ya NO devuelve siempre el mensaje de "producto
 *    con ventas". Se agregó un handler específico para `ProductoConVentasException`
 *    (que lanza ProductoService) y el handler genérico devuelve un mensaje neutro.
 * 2) Se mantiene el handler de RuntimeException para casos puntuales de negocio.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        String mensaje = ex.getMessage().contains("Bad credentials")
                ? "Email o contraseña incorrectos"
                : ex.getMessage();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", mensaje));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "No tenés permisos de Administrador para realizar esta acción"));
    }

    @ExceptionHandler(EmailYaRegistradoException.class)
    public ResponseEntity<Map<String, String>> handleEmailYaRegistrado(EmailYaRegistradoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(RecursoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    // ⚠️ NUEVO handler específico para el caso de "no se puede eliminar producto con ventas"
    @ExceptionHandler(ProductoConVentasException.class)
    public ResponseEntity<Map<String, String>> handleProductoConVentas(ProductoConVentasException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    // ⚠️ Handler genérico de integridad de datos: mensaje NEUTRO.
    // Los casos específicos (como producto con ventas) ya tienen su handler arriba.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Operación no permitida: existen datos relacionados que lo impiden."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno: " + ex.getMessage()));
    }
}