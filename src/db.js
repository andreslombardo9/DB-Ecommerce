import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Accede a las variables de entorno utilizando process.env
const { HOST, DATABASE, USER, PASSWORD } = process.env;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Sincroniza el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Modelo sincronizado con la base de datos');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo con la base de datos:', error);
  });

export { sequelize };
