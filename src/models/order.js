import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

import { User } from './user.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    deleted: {
        type: DataTypes.TINYINT,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
},
    {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at', // Asegúrate de usar el nombre correcto de la columna en la base de datos
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });

// Establecer la relación con la tabla "Users"
Order.belongsTo(User, { foreignKey: 'user_id' });

export { Order };
