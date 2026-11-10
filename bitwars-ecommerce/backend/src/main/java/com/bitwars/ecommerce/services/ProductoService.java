package com.bitwars.ecommerce.services;

import com.bitwars.ecommerce.exceptions.ProductoConVentasException;
import com.bitwars.ecommerce.exceptions.RecursoNoEncontradoException;
import com.bitwars.ecommerce.models.Producto;
import com.bitwars.ecommerce.repositories.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Grupo Bitwars
 * Clase: ProductoService
 *
 * ⚠️ CORRECCIONES APLICADAS:
 * 1) Se agregó `obtenerPorId()` para el nuevo endpoint GET /api/productos/{id}.
 * 2) En `eliminarProducto`, se atrapa el DataIntegrityViolationException y se
 *    lanza una `ProductoConVentasException` específica, así el GlobalExceptionHandler
 *    puede devolver el mensaje correcto (antes devolvía siempre el mensaje de producto
 *    con ventas, incluso si el error era por otro motivo).
 */
@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id " + id));
    }

    public Producto crearProducto(Producto producto) {
        if (producto.getStock() == null) {
            producto.setStock(0);
        }
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizarProducto(Long id, Producto datos) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id " + id));

        existente.setNombre(datos.getNombre());
        existente.setDescripcion(datos.getDescripcion());
        existente.setPrecio(datos.getPrecio());
        existente.setStock(datos.getStock() != null ? datos.getStock() : 0);
        existente.setCategoria(datos.getCategoria());
        existente.setImagenPrincipal(datos.getImagenPrincipal());
        existente.setImagen360(datos.getImagen360());
        existente.setDimensiones(datos.getDimensiones());
        existente.setTalles(datos.getTalles());
        existente.setGaleriaImagenes(datos.getGaleriaImagenes());

        return productoRepository.save(existente);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado con id " + id);
        }
        try {
            productoRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // ⚠️ Traducimos la violación de FK genérica a una excepción de dominio concreta
            throw new ProductoConVentasException(
                    "No se puede eliminar este producto porque tiene ventas asociadas en el historial. "
                  + "Si querés ocultarlo de la tienda, editá el producto y cambiale el stock a 0.");
        }
    }
}