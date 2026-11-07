package com.bitwars.ecommerce.controllers;

import com.bitwars.ecommerce.dto.CheckoutRequest;
import com.bitwars.ecommerce.models.Pedido;
import com.bitwars.ecommerce.services.PedidoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PagoController {

    private final PedidoService pedidoService;

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/crear-preferencia")
    public ResponseEntity<?> crearPreferencia(@RequestBody CheckoutRequest request) {
        
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío.");
        }

        try {
            // 1. Guardamos el pedido en la base de datos en estado PENDIENTE
            Pedido pedido = pedidoService.crearPedidoPendiente(request);

            MercadoPagoConfig.setAccessToken(accessToken);

            List<PreferenceItemRequest> items = new ArrayList<>();
            for (CheckoutRequest.ItemCarrito item : request.getItems()) {
                
                if (item.getPrecio() == null || item.getPrecio() <= 0) {
                    return ResponseEntity.badRequest().body("El precio del producto '" + item.getNombre() + "' no es válido.");
                }
                if (item.getCantidad() == null || item.getCantidad() <= 0) {
                    return ResponseEntity.badRequest().body("La cantidad del producto '" + item.getNombre() + "' no es válida.");
                }

                String tituloConTalle = item.getNombre() + 
                        (item.getTalle() != null ? " (Talle " + item.getTalle() + ")" : "");

                items.add(PreferenceItemRequest.builder()
                        .id(item.getId().toString())
                        .title(tituloConTalle)
                        .quantity(item.getCantidad())
                        .unitPrice(new BigDecimal(item.getPrecio()))
                        .currencyId("ARS")
                        .build());
            }

            // URLs de retorno
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(frontendUrl + "/pago-exitoso")
                    .failure(frontendUrl + "/pago-fallido")
                    .pending(frontendUrl + "/pago-pendiente")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .externalReference(pedido.getId().toString()) // ID del pedido
                    .autoReturn("approved") 
                    // 👇 FORZAMOS LA URL DEL WEBHOOK AQUÍ MISMO (Súper útil para Sandbox)
                    .notificationUrl("https://bitwars-backend-latest.onrender.com/api/pagos/webhook")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return ResponseEntity.ok(preference.getInitPoint());

        } catch (MPApiException e) {
            System.err.println("=== ERROR DE API DE MERCADO PAGO ===");
            System.err.println("Status: " + e.getApiResponse().getStatusCode());
            System.err.println("Respuesta: " + e.getApiResponse().getContent());
            return ResponseEntity.internalServerError().body("Error de Mercado Pago: Revisá la consola.");
            
        } catch (MPException e) {
            System.err.println("Error del SDK de MP: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error de conexión con Mercado Pago.");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    // =========================================================================
    // ENDPOINT TEMPORAL PARA PROBAR EMAIL Y STOCK (BORRAR ANTES DE LA ENTREGA)
    // =========================================================================
    @PostMapping("/simular-pago/{pedidoId}")
    public ResponseEntity<?> simularPago(@PathVariable Long pedidoId) {
        try {
            System.out.println("🧪 Simulando confirmación de pago para el Pedido #" + pedidoId);
            pedidoService.confirmarPago(pedidoId);
            return ResponseEntity.ok("✅ Simulación exitosa. Revisá el correo y la base de datos de Neon.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("❌ Error en simulación: " + e.getMessage());
        }
    }
}