package com.bitwars.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    private String emailUsuario; // Para saber quién compra
    private List<ItemCarrito> items;

    @Data
    public static class ItemCarrito {
        private Long id;
        private String nombre;
        private Integer cantidad;
        private Double precio;
        private String talle; // 👈 Agregamos el talle para guardarlo
    }
}