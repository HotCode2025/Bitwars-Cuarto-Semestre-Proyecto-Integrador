/*
 * Grupo Bitwars
 * Clase: Producto
 * Descripción: Entidad JPA que representa un producto en el catálogo.
 */
package com.bitwars.ecommerce.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String categoria;

    private String imagenPrincipal;
    private String imagen360; 

    // ========== NUEVOS CAMPOS ==========
    private String dimensiones;

    @ElementCollection
    @CollectionTable(name = "producto_talles", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "talle")
    private List<String> talles;

    @ElementCollection
    @CollectionTable(name = "producto_galeria", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen")
    private List<String> galeriaImagenes;
}