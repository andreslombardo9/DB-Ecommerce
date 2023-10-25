import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; 

const Dashboard = sequelize.define('Dashboard', {
    idTableroDeAdministracion: {
      type: DataTypes.INTEGER, // Tipo de dato para el ID del tablero de administración
      primaryKey: true, // Define como clave primaria
      autoIncrement: true // Autoincremental
    },
    vista: {
      type: DataTypes.STRING, // Tipo de dato para la vista (VARCHAR)
      allowNull: false // No permite valores nulos
    }
  }, {
    tableName: 'dashboard', // Nombre de la tabla en la base de datos (puede ser diferente)
    timestamps: false // Si no quieres campos de timestamp (created_at, updated_at)
  });
  

export {Dashboard};