package com.bitwars.ecommerce.services;

import com.bitwars.ecommerce.exceptions.EmailYaRegistradoException;
import com.bitwars.ecommerce.models.AuthRequest;
import com.bitwars.ecommerce.models.AuthResponse;
import com.bitwars.ecommerce.models.Rol;
import com.bitwars.ecommerce.models.Usuario;
import com.bitwars.ecommerce.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Grupo Bitwars
 * Clase: AuthService
 *
 * ⚠️ CORRECCIONES APLICADAS:
 * 1) Normalización de email a lowercase+trim ANTES de chequear duplicados en registro.
 *    Antes se podía registrar "User@Mail.com" cuando ya existía "user@mail.com".
 * 2) Misma normalización aplicada en login, para que el usuario no dependa de mayúsculas.
 * 3) Se mantienen todas las validaciones de campos y formatos originales.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // --- REGISTRO ---
    public AuthResponse registrar(AuthRequest request) {
        // ⚠️ Normalizamos ANTES de cualquier verificación
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();

        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new EmailYaRegistradoException("El correo electrónico ya está registrado.");
        }

        validarCamposObligatorios(request);

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }
        if (!request.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("El DNI debe tener 7 u 8 dígitos.");
        }
        if (!request.getCodigoPostal().matches("\\d{4}")) {
            throw new IllegalArgumentException("El código postal debe tener 4 dígitos.");
        }
        if (!request.getTelefono().replaceAll("[\\s-]", "").matches("\\d{6,15}")) {
            throw new IllegalArgumentException("El teléfono debe tener entre 6 y 15 dígitos.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre().trim())
                .email(email) // ⚠️ ya normalizado
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .telefono(request.getTelefono().trim())
                .dni(request.getDni().trim())
                .calle(request.getCalle().trim())
                .numero(request.getNumero().trim())
                .pisoDepto(request.getPisoDepto().trim())
                .localidad(request.getLocalidad().trim())
                .provincia(request.getProvincia().trim())
                .codigoPostal(request.getCodigoPostal().trim())
                .build();

        usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .mensaje("Usuario registrado exitosamente")
                .token(jwtToken)
                .build();
    }

    // --- LOGIN ---
    public AuthResponse login(AuthRequest request) {
        // ⚠️ Normalización también en login
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();

        System.out.println("🔍 Intentando login con: " + email);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (Exception e) {
            System.out.println("❌ Falló la autenticación: " + e.getMessage());
            throw e;
        }

        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        String jwtToken = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .mensaje("Login exitoso")
                .token(jwtToken)
                .build();
    }

    private void validarCamposObligatorios(AuthRequest r) {
        if (esVacio(r.getNombre()))        throw new IllegalArgumentException("El nombre es obligatorio.");
        if (esVacio(r.getEmail()))         throw new IllegalArgumentException("El email es obligatorio.");
        if (esVacio(r.getPassword()))      throw new IllegalArgumentException("La contraseña es obligatoria.");
        if (esVacio(r.getTelefono()))      throw new IllegalArgumentException("El teléfono es obligatorio.");
        if (esVacio(r.getDni()))           throw new IllegalArgumentException("El DNI es obligatorio.");
        if (esVacio(r.getCalle()))         throw new IllegalArgumentException("La calle es obligatoria.");
        if (esVacio(r.getNumero()))        throw new IllegalArgumentException("El número es obligatorio.");
        if (esVacio(r.getPisoDepto()))     throw new IllegalArgumentException("Piso/Depto es obligatorio (usá 'S/N' si no aplica).");
        if (esVacio(r.getLocalidad()))     throw new IllegalArgumentException("La localidad es obligatoria.");
        if (esVacio(r.getProvincia()))     throw new IllegalArgumentException("La provincia es obligatoria.");
        if (esVacio(r.getCodigoPostal()))  throw new IllegalArgumentException("El código postal es obligatorio.");
    }

    private boolean esVacio(String s) {
        return s == null || s.trim().isEmpty();
    }
}