import { Category } from "../models/categories.js";
import {Product } from "../models/products.js";
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};
// Controlador para crear una nueva categoría
export const createCategory = async (req, res) => {
  const { name, icon } = req.body;

  try {
    const newCategory = await Category.create({ name, icon });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Controlador para obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Controlador para actualizar una categoría por ID
export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, icon } = req.body;

  try {
    const category = await Category.findByPk(categoryId);

    if (category) {
      await category.update({ name, icon });
      res.json(category);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Controlador para eliminar una categoría por ID
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId);

    if (category) {
      await category.destroy();
      res.json({ message: 'Categoría eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // Obtén el ID de la categoría desde los parámetros de la solicitud

    const productsInCategory = await Product.findAll({
      where: {
        deleted: false,
      },
      include: {
        model: Category,
        as: 'categories',
        where: {
          id: categoryId, // Filtra por el ID de la categoría
        },
      },
    });

    const productsDataInCategory = productsInCategory.map((product) => {
      const productData = product.toJSON();
      productData.categories = productData.categories.map((category) => ({
        id: category.id,
        name: category.name,
        icon: category.icon
      }));
      return productData;
    });

    res.status(200).json(productsDataInCategory);
  } catch (error) {
    console.error('Error al obtener la lista de productos por categoría:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

