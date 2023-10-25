import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Product = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true, // Puedes cambiar esto según tus necesidades
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    urlImage: {
        type: DataTypes.STRING,
        allowNull: true, // Puedes cambiar esto según tus necesidades
    },
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at', // Si no deseas incluir campos de fecha de creación y actualización
});

export { Product };
