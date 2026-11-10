/*
 * Grupo Bitwars
 * Tecnicatura Universitaria en Programación
 * UTN Sede San Rafael Mendoza - Argentina
 * Octubre de 2026
 * 
 * Interfaz: ProductoRepository
 * Descripción: Repositorio para operaciones CRUD de productos.
 */
package com.bitwars.ecommerce.repositories;

import com.bitwars.ecommerce.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Método extra por si queremos filtrar por categoría
    List<Producto> findByCategoria(String categoria);
}