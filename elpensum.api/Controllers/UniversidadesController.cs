using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ElPensum.API.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones CRUD de universidades
    /// Proporciona endpoints para listar, crear, actualizar y eliminar universidades
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class UniversidadesController : ControllerBase
    {
        #region Private Fields
        private readonly ApplicationDbContext _context;
        #endregion

        #region Constructor
        /// <summary>
        /// Inicializa una nueva instancia del controlador de universidades
        /// </summary>
        /// <param name="context">Contexto de base de datos de la aplicación</param>
        public UniversidadesController(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        #endregion

        #region Public Endpoints

        /// <summary>
        /// Obtiene todas las universidades con sus carreras asociadas
        /// </summary>
        /// <returns>Lista de universidades</returns>
        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Universidad>>> ObtenerUniversidades()
        {
            try
            {
                var universidades = await _context.Universidades
                    .Include(universidad => universidad.Carreras)
                    .ToListAsync();

                return Ok(universidades);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, "Error al obtener la lista de universidades");
            }
        }

        /// <summary>
        /// Filtra universidades por nombre
        /// </summary>
        /// <param name="nombre">Nombre o parte del nombre de la universidad a buscar</param>
        /// <returns>Lista de universidades que coinciden con el filtro</returns>
        [HttpGet("filtrar")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Universidad>>> FiltrarUniversidades([FromQuery] string? nombre)
        {
            try
            {
                var consulta = _context.Universidades.AsQueryable();

                if (!string.IsNullOrWhiteSpace(nombre))
                {
                    consulta = consulta.Where(universidad => universidad.Nombre.Contains(nombre));
                }

                var universidades = await consulta.ToListAsync();
                return Ok(universidades);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, "Error al filtrar universidades");
            }
        }

        /// <summary>
        /// Obtiene una universidad específica por su ID
        /// </summary>
        /// <param name="id">ID de la universidad</param>
        /// <returns>Universidad solicitada o NotFound si no existe</returns>
        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<ActionResult<Universidad>> ObtenerUniversidadPorId(int id)
        {
            try
            {
                if (!EsIdValido(id))
                {
                    return BadRequest("El ID de la universidad debe ser mayor a 0");
                }

                var universidad = await _context.Universidades
                    .Include(u => u.Carreras)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (universidad == null)
                {
                    return NotFound($"No se encontró la universidad con ID {id}");
                }

                return Ok(universidad);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al obtener la universidad con ID {id}");
            }
        }

        /// <summary>
        /// Obtiene las carreras asignadas a una universidad específica
        /// </summary>
        /// <param name="id">ID de la universidad</param>
        /// <returns>Lista de carreras universitarias</returns>
        [HttpGet("{id}/carreras")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<CarreraUniversitaria>>> ObtenerCarrerasAsignadas(int id)
        {
            try
            {
                if (!EsIdValido(id))
                {
                    return BadRequest("El ID de la universidad debe ser mayor a 0");
                }

                var existeUniversidad = await _context.Universidades.AnyAsync(u => u.Id == id);
                if (!existeUniversidad)
                {
                    return NotFound($"No se encontró la universidad con ID {id}");
                }

                var carreras = await _context.CarrerasUniversitarias
                    .Include(cu => cu.Carrera)
                    .Where(cu => cu.UniversidadId == id)
                    .ToListAsync();

                return Ok(carreras);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al obtener las carreras de la universidad con ID {id}");
            }
        }

        /// <summary>
        /// Obtiene las universidades que ofrecen una carrera específica
        /// </summary>
        /// <param name="idCarrera">ID de la carrera</param>
        /// <returns>Lista de universidades que ofrecen la carrera</returns>
        [HttpGet("por-carrera/{idCarrera}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Universidad>>> ObtenerUniversidadesPorCarrera(int idCarrera)
        {
            try
            {
                if (!EsIdValido(idCarrera))
                {
                    return BadRequest("El ID de la carrera debe ser mayor a 0");
                }

                var universidades = await _context.CarrerasUniversitarias
                    .Include(cu => cu.Universidad)
                    .Where(cu => cu.CarreraId == idCarrera && cu.Universidad != null)
                    .Select(cu => cu.Universidad!)
                    .Distinct()
                    .ToListAsync();

                return Ok(universidades);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al obtener universidades por carrera con ID {idCarrera}");
            }
        }

        /// <summary>
        /// Obtiene el ID de una universidad por su nombre
        /// </summary>
        /// <param name="nombre">Nombre de la universidad</param>
        /// <returns>ID de la universidad</returns>
        [HttpGet("id")]
        [AllowAnonymous]
        public async Task<ActionResult<int>> ObtenerIdPorNombre([FromQuery] string nombre)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nombre))
                {
                    return BadRequest("El nombre de la universidad es requerido");
                }

                var universidad = await _context.Universidades
                    .FirstOrDefaultAsync(u => u.Nombre.ToLower() == nombre.ToLower());

                if (universidad == null)
                {
                    return NotFound($"No se encontró la universidad con nombre '{nombre}'");
                }

                return Ok(universidad.Id);
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al buscar universidad por nombre '{nombre}'");
            }
        }

        /// <summary>
        /// Crea una nueva universidad
        /// </summary>
        /// <param name="universidad">Datos de la universidad a crear</param>
        /// <returns>Universidad creada</returns>
        [HttpPost]
        public async Task<ActionResult<Universidad>> CrearUniversidad(Universidad universidad)
        {
            try
            {
                var validacionResult = ValidarUniversidad(universidad);
                if (!validacionResult.EsValida)
                {
                    return BadRequest(validacionResult.MensajeError);
                }

                var existeNombre = await ExisteNombreUniversidad(universidad.Nombre);
                if (existeNombre)
                {
                    return Conflict($"Ya existe una universidad con el nombre '{universidad.Nombre}'");
                }

                _context.Universidades.Add(universidad);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(ObtenerUniversidadPorId), 
                    new { id = universidad.Id }, 
                    universidad
                );
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, "Error al crear la universidad");
            }
        }

        /// <summary>
        /// Actualiza una universidad existente
        /// </summary>
        /// <param name="id">ID de la universidad a actualizar</param>
        /// <param name="universidad">Nuevos datos de la universidad</param>
        /// <returns>NoContent si la actualización fue exitosa</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUniversidad(int id, Universidad universidad)
        {
            try
            {
                if (id != universidad.Id)
                {
                    return BadRequest("El ID de la URL no coincide con el ID de la universidad");
                }

                var validacionResult = ValidarUniversidad(universidad);
                if (!validacionResult.EsValida)
                {
                    return BadRequest(validacionResult.MensajeError);
                }

                var existeOtraConMismoNombre = await ExisteNombreUniversidad(universidad.Nombre, id);
                if (existeOtraConMismoNombre)
                {
                    return Conflict($"Ya existe otra universidad con el nombre '{universidad.Nombre}'");
                }

                _context.Entry(universidad).State = EntityState.Modified;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ExisteUniversidad(id))
                {
                    return NotFound($"No se encontró la universidad con ID {id}");
                }
                throw;
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al actualizar la universidad con ID {id}");
            }
        }

        /// <summary>
        /// Elimina una universidad
        /// </summary>
        /// <param name="id">ID de la universidad a eliminar</param>
        /// <returns>NoContent si la eliminación fue exitosa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUniversidad(int id)
        {
            try
            {
                if (!EsIdValido(id))
                {
                    return BadRequest("El ID de la universidad debe ser mayor a 0");
                }

                var universidad = await _context.Universidades.FindAsync(id);
                if (universidad == null)
                {
                    return NotFound($"No se encontró la universidad con ID {id}");
                }

                var tieneCarrerasAsociadas = await _context.CarrerasUniversitarias
                    .AnyAsync(cu => cu.UniversidadId == id);

                if (tieneCarrerasAsociadas)
                {
                    return BadRequest("No se puede eliminar la universidad porque tiene carreras asociadas");
                }

                _context.Universidades.Remove(universidad);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return ManejaarErrorInterno(ex, $"Error al eliminar la universidad con ID {id}");
            }
        }

        #endregion

        #region Private Helper Methods

        /// <summary>
        /// Valida si un ID es válido (mayor a 0)
        /// </summary>
        /// <param name="id">ID a validar</param>
        /// <returns>True si es válido, false en caso contrario</returns>
        private static bool EsIdValido(int id) => id > 0;

        /// <summary>
        /// Verifica si existe una universidad con el ID especificado
        /// </summary>
        /// <param name="id">ID de la universidad</param>
        /// <returns>True si existe, false en caso contrario</returns>
        private async Task<bool> ExisteUniversidad(int id)
        {
            return await _context.Universidades.AnyAsync(u => u.Id == id);
        }

        /// <summary>
        /// Verifica si existe una universidad con el nombre especificado
        /// </summary>
        /// <param name="nombre">Nombre de la universidad</param>
        /// <param name="excluirId">ID a excluir de la búsqueda (para actualizaciones)</param>
        /// <returns>True si existe, false en caso contrario</returns>
        private async Task<bool> ExisteNombreUniversidad(string nombre, int? excluirId = null)
        {
            var consulta = _context.Universidades
                .Where(u => u.Nombre.ToLower() == nombre.ToLower());

            if (excluirId.HasValue)
            {
                consulta = consulta.Where(u => u.Id != excluirId.Value);
            }

            return await consulta.AnyAsync();
        }

        /// <summary>
        /// Valida los datos de una universidad
        /// </summary>
        /// <param name="universidad">Universidad a validar</param>
        /// <returns>Resultado de la validación</returns>
        private static (bool EsValida, string MensajeError) ValidarUniversidad(Universidad universidad)
        {
            if (universidad == null)
            {
                return (false, "Los datos de la universidad son requeridos");
            }

            if (string.IsNullOrWhiteSpace(universidad.Nombre))
            {
                return (false, "El nombre de la universidad es requerido");
            }

            if (string.IsNullOrWhiteSpace(universidad.Pais))
            {
                return (false, "El país de la universidad es requerido");
            }

            if (string.IsNullOrWhiteSpace(universidad.Ciudad))
            {
                return (false, "La ciudad de la universidad es requerida");
            }

            if (string.IsNullOrWhiteSpace(universidad.LogoUrl))
            {
                return (false, "La URL del logo es requerida");
            }

            return (true, string.Empty);
        }

        /// <summary>
        /// Maneja errores internos del servidor
        /// </summary>
        /// <param name="ex">Excepción ocurrida</param>
        /// <param name="mensaje">Mensaje personalizado del error</param>
        /// <returns>Respuesta de error interno del servidor</returns>
        private ObjectResult ManejaarErrorInterno(Exception ex, string mensaje)
        {
            // En un entorno de producción, se debería usar un logger
            // Logger.LogError(ex, mensaje);
            
            return StatusCode(500, new { 
                mensaje = mensaje,
                detalle = "Ha ocurrido un error interno en el servidor"
            });
        }

        #endregion
    }
}
