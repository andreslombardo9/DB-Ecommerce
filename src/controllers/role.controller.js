import { Role } from '../models/role.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

export const createRole = async (req, res) => {
    try {
        const { nombre } = req.body;
    
        // Crea un nuevo rol con los datos
        const nuevoRol = await Role.create({
          nombre,
        });
    
        res.status(201).json(nuevoRol);
      } catch (error) {
        console.error('Error al crear el rol:', error);
        return res.status(500).json({ message: 'Something went wrong' });
      }
}

export const getRoleForId = async (req, res) => {
    const rolId = req.params.id;
    try {
      const rol = await Role.findByPk(rolId);
      if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      res.status(200).json(rol);
    } catch (error) {
      console.error('Error al obtener el rol por ID:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateRole = async (req, res) => {
    const rolId = req.params.id;
    const { nombre } = req.body;
    try {
      const rol = await Role.findByPk(rolId);
      if (!rol) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      // Actualiza los datos del rol
      rol.nombre = nombre;
      await rol.save();
      res.status(200).json(rol);
    } catch (error) {
      console.error('Error al actualizar el rol por ID:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
}

export const deleteRole = async (req, res) => {
    const rolId = req.params.id;
  try {
    const rol = await Role.findByPk(rolId);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    await rol.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al borrar el rol por ID:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}