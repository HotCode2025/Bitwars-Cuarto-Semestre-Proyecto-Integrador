package com.bitwars.ecommerce.controllers;

import com.bitwars.ecommerce.services.PedidoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Grupo Bitwars
 * Clase: PagoWebhookController
 *
 * ⚠️ NOTAS DE SEGURIDAD (deuda técnica documentada, no bloqueante para la entrega):
 * - La validación de firma `x-signature` de Mercado Pago NO está implementada.
 * - Igual, el impacto real está limitado: este endpoint consulta la API de MP
 *   para verificar el pago real antes de confirmar. Un atacante solo podría
 *   spamear requests, no marcar pagos falsos como aprobados.
 * - Para producción con volumen, implementar validación de firma con
 *   `mp.webhook-secret` (parsear x-signature, reconstruir manifest, HMAC-SHA256).
 *
 * ⚠️ Endpoint público: está permitido en SecurityConfig con
 *    .requestMatchers("/api/pagos/webhook").permitAll()
 */
@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoWebhookController {

    private final PedidoService pedidoService;

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @PostMapping("/webhook")
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");

            if ("payment".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                Long paymentId = Long.valueOf(data.get("id").toString());

                MercadoPagoConfig.setAccessToken(accessToken);
                PaymentClient client = new PaymentClient();
                Payment payment = client.get(paymentId);

                String status = payment.getStatus();

                System.out.println("🔔 Webhook MP: Pago ID " + paymentId + " - Estado: " + status);

                if ("approved".equals(status)) {
                    String externalRef = payment.getExternalReference();

                    if (externalRef != null && !externalRef.isEmpty()) {
                        Long pedidoId = Long.valueOf(externalRef);
                        pedidoService.confirmarPago(pedidoId);
                        System.out.println("✅ Pedido #" + pedidoId + " confirmado y stock descontado.");
                    } else {
                        System.out.println("⚠️ Pago aprobado sin externalReference (Pedido ID).");
                    }
                }
            }

            // Mercado Pago necesita 200 OK para saber que recibimos la notificación
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}