import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

import { Role } from './role.js'; // Asegúrate de que la ruta sea correcta


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rol_idrol: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.TINYINT,
        allowNull: false,
    }
  
}, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

// Define las relaciones utilizando belongsTo

User.belongsTo(Role, { foreignKey: 'rol_idrol' });


export { User };

