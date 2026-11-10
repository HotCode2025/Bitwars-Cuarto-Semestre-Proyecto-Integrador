package com.bitwars.ecommerce.services;

import com.bitwars.ecommerce.dto.CheckoutRequest;
import com.bitwars.ecommerce.models.*;
import com.bitwars.ecommerce.repositories.PedidoRepository;
import com.bitwars.ecommerce.repositories.ProductoRepository;
import com.bitwars.ecommerce.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public Pedido crearPedidoPendiente(CheckoutRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmailUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.ItemCarrito item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getId()));

            // Validación de stock 
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("Cantidad inválida para el producto: " + producto.getNombre());
            }
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre()
                        + " (disponible: " + producto.getStock() + ")");
            }

            // ⚠️ Usar SIEMPRE el precio de la BD, NUNCA el que viene en el request
            BigDecimal precioReal = producto.getPrecio();
            BigDecimal subtotal = precioReal.multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            detalles.add(DetallePedido.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .talle(item.getTalle())
                    .subtotal(subtotal)
                    .build());
        }

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .fecha(LocalDateTime.now())
                .total(total)
                .estado(EstadoPedido.PENDIENTE)
                .detalles(detalles)
                .build();

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public void confirmarPago(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == EstadoPedido.PAGADO) return; // idempotente

        pedido.setEstado(EstadoPedido.PAGADO);

        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            int nuevoStock = producto.getStock() - detalle.getCantidad();
            if (nuevoStock < 0) nuevoStock = 0;

            producto.setStock(nuevoStock);
            productoRepository.save(producto);
        }

        pedidoRepository.save(pedido);

        
        System.out.println("✅ Pedido #" + pedido.getId() + " confirmado y stock descontado.");
    }
}