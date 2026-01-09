import Sequelize from "sequelize";
import db from "../config/db.js";

export const Jugador = db.define(
    "Jugador",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        posicion: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        nacionalidad: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        dorsal: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "jugadores",
        timestamps: false
    }
);

