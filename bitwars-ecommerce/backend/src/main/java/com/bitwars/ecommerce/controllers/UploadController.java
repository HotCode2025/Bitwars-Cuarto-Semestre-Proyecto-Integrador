package com.bitwars.ecommerce.controllers;

import com.bitwars.ecommerce.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * ⚠️ CORRECCIÓN APLICADA:
 * Se quitó @CrossOrigin(origins = "*"). El CORS global en SecurityConfig maneja todo.
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> subirArchivo(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.subirImagen(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            System.out.println("❌ Error subiendo a Cloudinary: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al subir imagen: " + e.getMessage()));
        }
    }
}