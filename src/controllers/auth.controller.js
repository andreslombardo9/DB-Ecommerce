import { User} from "../models/user.js";
import bcrypt from 'bcrypt';

import { createAccessToken } from "../libs/jwt.js";
import { Role } from "../models/role.js";


export const register = async (req, res) => {
    const { name, last_name, email, password } = req.body;
  
    try {
      // Verificar si el correo electrónico ya está en uso
      const userFound = await User.findOne({ where: { email } });
  
      if (userFound) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
  
      // Encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);
  
      // Obtener el rol "usuario" que corresponde al número 2
      const role = await Role.findOne({ where: { id: 2 } });
  
      if (!role) {
        return res.status(500).json({ message: 'Error al asignar el rol "usuario"' });
      }
  
      // Crear el nuevo usuario con el rol "usuario"
      const newUser = await User.create({
        name,
        last_name,
        email,
        password: passwordHash,
        rol_idrol: role.id,
        deleted: false, // Corregir el nombre de la columna aquí
      });
  
      // Crear el token
      const token = await createAccessToken({ id: newUser.id, rol: role.id });
  
      // Respuesta al frontend
      res.json({
        id: newUser.id,
        name: newUser.name,
        last_name: newUser.last_name,
        email: newUser.email,
        rol: role.name,
        deleted: false, // Devolvemos el nombre del rol
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };


  export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por su correo electrónico
        const userFound = await User.findOne({ where: { email } });

        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la del usuario
        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Obtener el rol del usuario
        const userRole = await Role.findOne({ where: { id: userFound.rol_idrol } });

        if (!userRole) {
            return res.status(500).json({ message: 'Error al obtener el rol del usuario' });
        }

        // Obtener el user_id
        const user_id = userFound.id;

        // Crear el token de acceso
        const token = await createAccessToken({ id: user_id, rol: userRole.name });

        // Guardar el token en una cookie
        res.cookie('token', token, {
            httpOnly: true, // Solo accesible a través de HTTP
            secure: process.env.NODE_ENV === 'production', // Requiere HTTPS en producción
            sameSite: 'Lax', // Opcional: configuración de SameSite
        });

        res.json({ token, userRole, user_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const logout = (req, res) => {
  // Borrar la cookie del token
  res.clearCookie('token');
  
  // Puedes responder con un mensaje indicando que el usuario se ha desconectado exitosamente
  res.json({ message: 'Desconexión exitosa' });
};