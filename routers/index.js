import express from 'express';
import {
    paginaInicio,
    paginaNosotros,
    paginaPartidos,
    paginaAficion,
    paginaDetallesPartido,
    paginaFicha,
    guardarJugador,
    guardarAficion,
    guardarCompra,
    paginaComprar,
    paginaCrearPartido,
    guardarPartido,
    paginaVerJugadores,
} from "../controllers/paginaController.js";

const router = express.Router();

// Página de inicio
router.get('/', paginaInicio);

// Página Nosotros
router.get('/nosotros', paginaNosotros);

// Página Afición
router.get('/aficion', paginaAficion);

// Página Partidos
router.get('/partidos', paginaPartidos);

// Detalle de un partido por slug
router.get('/partidos/:slug', paginaDetallesPartido);



// Guardar aficionado
router.post('/aficion', guardarAficion);

// Guardar jugador
router.post('/ficha', guardarJugador);

router.get('/ficha', paginaFicha);


router.get('/comprar/:slug', paginaComprar);

router.post('/comprar', guardarCompra);

// Mostrar formulario crear partido
router.get('/crear-partido', paginaCrearPartido);

// Guardar partido
router.post('/crear-partido', guardarPartido);

router.get('/ver-jugadores', paginaVerJugadores);


export default router;
