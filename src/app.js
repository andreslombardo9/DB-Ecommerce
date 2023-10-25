import express from 'express';
import morgan from "morgan";
import { sequelize } from './db.js';

const app = express();
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
  });

app.use(morgan('dev'));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate();
    await Product.sync();
    await Employee.sync();
    next();
  } catch (error) {
    res.status(500).json({error: 'Error en el servidor.'});
  }
})


export default app;