package com.bitwars.ecommerce.controllers;

import com.bitwars.ecommerce.models.AuthRequest;
import com.bitwars.ecommerce.models.AuthResponse;
import com.bitwars.ecommerce.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ⚠️ CORRECCIÓN APLICADA:
 * Se quitó @CrossOrigin(origins = "*"). El CORS global en SecurityConfig
 * ya maneja las reglas dinámicamente. Tener ambos con allowCredentials(true)
 * genera headers inválidos que el navegador rechaza.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registrar(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}