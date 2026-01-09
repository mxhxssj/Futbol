import Sequelize from "sequelize";
import db from "../config/db.js";

export const Partido = db.define(
    "Partido",
    {
        rival: {
            type: Sequelize.STRING,
            allowNull: false
        },
        competicion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: false
        },
        hora: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imagen: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.TEXT
        },
        estadio: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
        }
    },
    {
        tableName: "partidos",
        timestamps: false
    }
);
