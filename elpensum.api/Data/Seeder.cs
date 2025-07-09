using ElPensum.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace ElPensum.API.Data
{
    public static class Seeder
    {
        public static void Inicializar(ApplicationDbContext context)
        {
            if (!context.Universidades.Any())
            {
                // Crear carreras
                var carrera1 = new Carrera { Nombre = "Ingeniería en Sistemas" };
                var carrera2 = new Carrera { Nombre = "Medicina" };

                // Crear universidades
                var universidad1 = new Universidad
                {
                    Nombre = "Universidad Autónoma de Santo Domingo (UASD)",
                    Pais = "República Dominicana",
                    Ciudad = "Santo Domingo",
                    RankingNacional = 1,
                    RankingMundial = 1500,
                    LogoUrl = "/assets/universidades/logos/uasd.png",
                    ImagenesCampus = new List<string> {
                        "/assets/universidades/campus/uasd-campus1.jpg",
                        "/assets/universidades/campus/uasd-campus2.jpg"
                    }
                };

                var universidad2 = new Universidad
                {
                    Nombre = "Pontificia Universidad Católica Madre y Maestra (PUCMM)",
                    Pais = "República Dominicana",
                    Ciudad = "Santiago",
                    RankingNacional = 2,
                    RankingMundial = 1200,
                    LogoUrl = "/assets/universidades/logos/pucmm.png",
                    ImagenesCampus = new List<string> {
                        "/assets/universidades/campus/pucmm-campus1.jpg",
                        "/assets/universidades/campus/pucmm-campus2.jpg"
                    }
                };

                var universidad3 = new Universidad
                {
                    Nombre = "Instituto Tecnológico de Santo Domingo (INTEC)",
                    Pais = "República Dominicana",
                    Ciudad = "Santo Domingo",
                    RankingNacional = 3,
                    RankingMundial = 1300,
                    LogoUrl = "/assets/universidades/logos/intec.png",
                    ImagenesCampus = new List<string> {
                        "/assets/universidades/campus/intec-campus1.jpg",
                        "/assets/universidades/campus/intec-campus2.jpg"
                    }
                };

                var relacion1 = new CarreraUniversitaria
                {
                    Universidad = universidad1,
                    Carrera = carrera1,
                    DuracionAnios = 5,
                    CostoInscripcion = 3000,
                    CostoAdmision = 2000,
                    CostoCredito = 1200,
                    TotalCreditos = 180,
                    CostoCarnet = 500,
                    PensumPdf = "/assets/pensum/pensum-uasd-sistemas.pdf"
                };

                var relacion2 = new CarreraUniversitaria
                {
                    Universidad = universidad2,
                    Carrera = carrera2,
                    DuracionAnios = 6,
                    CostoInscripcion = 4000,
                    CostoAdmision = 2500,
                    CostoCredito = 1500,
                    TotalCreditos = 200,
                    CostoCarnet = 600,
                    PensumPdf = "/assets/pensum/pensum-pucmm-medicina.pdf"
                };

                var relacion3 = new CarreraUniversitaria
                {
                    Universidad = universidad3,
                    Carrera = carrera1,
                    DuracionAnios = 4,
                    CostoInscripcion = 3500,
                    CostoAdmision = 1800,
                    CostoCredito = 1400,
                    TotalCreditos = 190,
                    CostoCarnet = 550,
                    PensumPdf = "/assets/pensum/pensum-intec-sistemas.pdf"
                };

                context.Carreras.AddRange(carrera1, carrera2);
                context.Universidades.AddRange(universidad1, universidad2, universidad3);
                context.CarrerasUniversitarias.AddRange(relacion1, relacion2, relacion3);
                context.SaveChanges();
            }

            // Usuario admin deshabilitado para producción
            /*
            if (!context.Usuarios.Any(u => u.Username == ""))
            {
                using var sha256 = SHA256.Create();
                var password = "!";
                var passwordHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));

                var usuario = new Usuario
                {
                    Username = "",
                    PasswordHash = passwordHash
                };

                context.Usuarios.Add(usuario);
                context.SaveChanges();
            }
            */
        }
    }
}
