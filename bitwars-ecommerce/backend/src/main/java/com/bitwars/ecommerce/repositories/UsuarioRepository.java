/*
 * Grupo Bitwars
 * Tecnicatura Universitaria en Programación
 * UTN Sede San Rafael Mendoza - Argentina
 * Octubre de 2026
 * 
 * Interfaz: UsuarioRepository
 * Descripción: Repositorio para realizar operaciones CRUD en la tabla de usuarios.
 */
package com.bitwars.ecommerce.repositories;

import com.bitwars.ecommerce.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Spring Data JPA crea la consulta SQL automáticamente a partir del nombre del método
    Optional<Usuario> findByEmail(String email);
}