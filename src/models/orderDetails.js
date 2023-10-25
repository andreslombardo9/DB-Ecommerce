import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Product } from './products.js';
import { Order } from './order.js';

const ProductOrder = sequelize.define('ProductOrder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orders_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    products_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.TINYINT,
    },

},
    {
        tableName: 'products_order',
        timestamps: true,
        createdAt: 'created_at', // Asegúrate de usar el nombre correcto de la columna en la base de datos
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });

ProductOrder.belongsTo(Order, { foreignKey: 'orders_id' });
ProductOrder.belongsTo(Product, { foreignKey: 'products_id' });
export { ProductOrder };
