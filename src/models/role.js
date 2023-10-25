import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; // Debes tener una instancia de Sequelize configurada previamente.

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER, // Tipo de dato para el ID del rol
    primaryKey: true, // Define como clave primaria
    autoIncrement: true // Autoincremental
  },
  name: {
    type: DataTypes.STRING, // Tipo de dato para el nombre del rol (VARCHAR)
    allowNull: false // No permite valores nulos
  }
}, {
  tableName: 'role', // Nombre de la tabla en la base de datos (puede ser diferente)
  timestamps: false // Si no quieres campos de timestamp (created_at, updated_at)
});

// Define las relaciones con otras tablas si es necesario

export {Role};
