import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccessToken } from "../libs/jwt.js";
import { Role } from "../models/role.js";
import { TOKEN_SECRET } from '../config.js';

export const register = async (req, res) => {
  const { name, last_name, email, password } = req.body;

  try {
    // Verificar si el correo electrónico ya está en uso
    const userFound = await User.findOne({ where: { email } });

    if (userFound) {
      return res.status(400).json(['El correo electrónico ya está en uso']);
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,  // Ajusta esto según tu entorno de desarrollo
      sameSite: 'Lax',
      domain: 'localhost',  // Ajusta esto según tu configuración de desarrollo
    });

    res.json({
      token,
      userRole: userRole,
      email: userFound.email,
      name: userFound.name,
      last_name: userFound.last_name,
      id: userFound.id,
    });
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
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = jwt.verify(token, TOKEN_SECRET);
    // Aquí puedes agregar lógica adicional, como volver a emitir un nuevo token si es necesario.
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      domain: 'localhost', // Añade esta línea
    });


    return res.json({
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (err) {
    // El token no es válido, por lo que el usuario se considera no autenticado.
    res.clearCookie('token');
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscar al usuario (incluyendo la relación con el rol)
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'Role' }],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario según lo recibido en el cuerpo de la solicitud
    user.name = req.body.name || user.name;
    user.last_name = req.body.last_name || user.last_name;

    // Verifica si user.rol está definido antes de intentar acceder a sus propiedades
    if (user.Role) {
      user.Role.name = req.body.rol || user.Role.name; // Modifica según tus necesidades
    }

    // Guardar los cambios en la base de datos
    await user.save();

    // Opcional: Puedes volver a emitir el token con los datos actualizados si es necesario
    const token = await createAccessToken({ id: user.id, rol: user.rol_idrol });

    // Respuesta exitosa
    res.json({
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      rol: user.Role ? user.Role.name : null, // Devolvemos el nombre del rol si está definido
      deleted: user.deleted,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


