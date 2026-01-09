import { Partido } from "../models/Partido.js";
import { Aficion } from "../models/aficcion.js";
import { Jugador } from "../models/Jugador.js";

import moment from 'moment';

/* =========================
   PÁGINA INICIO
========================= */
const paginaInicio = async (req, res) => {

    const promiseDB = [];

    promiseDB.push(Partido.findAll({ limit: 3 }));

    promiseDB.push(Aficion.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    try {
        const resultado = await Promise.all(promiseDB);

        res.render('inicio', {
            pagina: 'Inicio',
            clase: 'home',
            partidos: resultado[0],
            aficiones: resultado[1],
            moment: moment,
        });

    } catch (err) {
        console.log(err);
    }
};

/* =========================
   NOSOTROS
========================= */
const paginaNosotros = (req, res) => {
    res.render('nosotros', {
        pagina: 'Nosotros',
        moment: moment,
    });
};

/* =========================
   PARTIDOS
========================= */
const paginaPartidos = async (req, res) => {
   const partidos = await Partido.findAll();


    res.render('partidos', {
        pagina: 'Partidos',
        partidos: partidos,
        moment: moment,
    });
};

/* =========================
   AFICIÓN
========================= */
const paginaAficion = async (req, res) => {
    try {
        const aficiones = await Aficion.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('aficion', {
            pagina: 'Afición',
            aficiones: aficiones,
            moment: moment,
        });
    } catch (err) {
        console.log(err);
    }
};

/* =========================
   DETALLE PARTIDO
========================= */
const paginaDetallesPartido = async (req, res) => {
    const { slug } = req.params;

    const resultado = await Partido.findOne({ where: { slug } });
    const partidos = await Partido.findAll({ limit: 3 });

    res.render('partido', {
        pagina: 'Detalle del Partido',
        resultado,
        partidos,
        moment
    });
};


/* =========================
   FICHA PARTIDO
========================= */
const paginaFicha = (req, res) => {
    res.render('ficha', {
        pagina: 'Ficha del Jugador',
        errores: [],
        nombre: '',
        posicion: '',
        nacionalidad: '',
        dorsal: ''
    });
};


/* =========================
   GUARDAR JUGADOR
========================= */
const guardarJugador = async (req, res) => {

    const { nombre, posicion, nacionalidad, dorsal } = req.body;
    const errores = [];

    if (!nombre || nombre.trim() === '') errores.push({ mensaje: 'El nombre está vacío' });
    if (!posicion || posicion.trim() === '') errores.push({ mensaje: 'La posición está vacía' });
    if (!nacionalidad || nacionalidad.trim() === '') errores.push({ mensaje: 'La nacionalidad está vacía' });
    if (!dorsal || dorsal.trim() === '') errores.push({ mensaje: 'El dorsal está vacío' });

    if (errores.length > 0) {
        return res.render('ficha', {
            pagina: 'Ficha del Jugador',
            errores,
            nombre,
            posicion,
            nacionalidad,
            dorsal
        });
    }

    try {
        await Jugador.create({
            nombre,
            posicion,
            nacionalidad,
            dorsal,
        });

        res.redirect('/ver-jugadores');

    } catch (error) {
        console.log(error);
    }
};


/* =========================
   CREAR PARTIDO (FORM)
========================= */
const paginaCrearPartido = (req, res) => {
    res.render('crear-partido', {
        pagina: 'Crear Partido',
    });
};

/* =========================
   GUARDAR PARTIDO
========================= */
const guardarPartido = async (req, res) => {
    const { rival, fecha, hora, estadio, descripcion, imagen,competicion } = req.body;

    const errores = [];

    if (rival.trim() === '') errores.push({ mensaje: 'El rival está vacío' });
    if (fecha.trim() === '') errores.push({ mensaje: 'La fecha está vacía' });
    if (hora.trim() === '') errores.push({ mensaje: 'La hora está vacía' });
    if (estadio.trim() === '') errores.push({ mensaje: 'El estadio está vacío' });
    if (descripcion.trim() === '') errores.push({ mensaje: 'La descripción está vacía' });

    if (!competicion || competicion.trim() === '') {
        errores.push({ mensaje: 'La competición es obligatoria' });
    }

    if (errores.length > 0) {
        return res.render('crear-partido', {
            pagina: 'Crear Partido',
            errores,
            rival,
            fecha,
            hora,
            estadio,
            descripcion,
            imagen,
            competicion,
        });
    }

    try {
        await Partido.create({
            rival,
            fecha,
            hora,
            estadio,
            descripcion,
            imagen,
            competicion,
            slug: rival.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        });

        res.redirect('/partidos');
    } catch (error) {
        console.log(error);
    }
};



/* =========================
   COMPRAR ENTRADA
========================= */
const paginaComprar = async (req, res) => {
    const { slug } = req.params;

    try {
        const resultado = await Partido.findOne({
            where: { slug }
        });

        if (!resultado) {
            return res.redirect('/partidos');
        }

        res.render('comprarEntrada', {
            pagina: 'Comprar Entrada',
            resultado,
            moment
        });

    } catch (error) {
        console.log(error);
    }
};


const guardarCompra = async (req, res) => {

    const { nombre, correo, telefono, slug } = req.body;
    const errores = [];


    if (!nombre || nombre.trim() === '') {
        errores.push({ mensaje: 'El nombre está vacío' });
    }

    if (!correo || correo.trim() === '') {
        errores.push({ mensaje: 'El correo está vacío' });
    }

    if (!telefono || telefono.trim() === '') {
        errores.push({ mensaje: 'El teléfono está vacío' });
    }


    const resultado = await Partido.findOne({
        where: { slug }
    });


    if (!resultado) {
        return res.redirect('/partidos');
    }

    // Si hay errores para volver a comprar
    if (errores.length > 0) {
        return res.render('comprarEntrada', {
            pagina: 'Comprar Entrada',
            errores,
            nombre,
            correo,
            telefono,
            resultado,
            moment
        });
    }

    try {
        //  Guardar compra
        await Aficion.create({
            nombre,
            pais: 'España',
            comentario: `Compra de entrada para Real Madrid vs ${resultado.rival}`
        });

        //  MOSTRAR CONFIRMACIÓN
        res.render('enviarmail', {
            pagina: 'Compra realizada',
            resultado
        });

    } catch (error) {
        console.log(error);
    }
};


/* =========================
   VER JUGADORES
========================= */
const paginaVerJugadores = async (req, res) => {
    try {
        const jugadores = await Jugador.findAll();

        res.render('ver-jugadores', {
            pagina: 'Jugadores del Real Madrid',
            jugadores,
        });
    } catch (error) {
        console.log(error);
    }
};


/* =========================
   GUARDAR AFICIÓN
========================= */
const guardarAficion = async (req, res) => {

    const { nombre, pais, comentario } = req.body;
    const errores = [];

    if (nombre.trim() === '') errores.push({ mensaje: 'El nombre está vacío' });
    if (pais.trim() === '') errores.push({ mensaje: 'El país está vacío' });
    if (comentario.trim() === '') errores.push({ mensaje: 'El comentario está vacío' });

    if (errores.length > 0) {
        const aficiones = await Aficion.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });

        res.render('aficion', {
            pagina: 'Afición',
            errores,
            nombre,
            pais,
            comentario,
            aficiones,
        });
    } else {
        try {
            await Aficion.create({ nombre, pais, comentario });
            res.redirect('/aficion');
        } catch (error) {
            console.log(error);
        }
    }
};

export {
    paginaInicio,
    paginaNosotros,
    paginaPartidos,
    paginaAficion,
    paginaDetallesPartido,
    paginaFicha,
    guardarJugador,
    guardarAficion,
    paginaComprar,
    guardarCompra,
    paginaCrearPartido,
    guardarPartido,
    paginaVerJugadores,
};
