import express from 'express';
import morgan from 'morgan';
import productRoutes from './routes/products.routes.js'
import orderDetailsRoutes from './routes/orderDetails.routes.js'
import RoleRoutes from './routes/rol.routes.js';
import orderRoutes from './routes/order.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import categoriesRoutes from './routes/categories.routes.js'
import { sequelize } from './db.js';
import cors from "cors";
const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use('/api', categoriesRoutes)
app.use('/api', productRoutes);
app.use('/api', orderDetailsRoutes);
app.use('/api', RoleRoutes);
app.use('/api', orderRoutes);
app.use('/api', authRoutes);