import Sequelize from "sequelize";
import db from "../config/db.js";

export const Aficion = db.define(
    "aficiones",
    {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pais: {
            type: Sequelize.STRING,
            allowNull: false
        },
        comentario: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);
