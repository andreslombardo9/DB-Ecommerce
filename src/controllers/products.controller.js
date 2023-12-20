import { Category } from "../models/categories.js";
import { Product } from "../models/products.js";
import { sequelize } from "../db.js";

// controllers/products.controller.js
export const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      where: {
        deleted: false,
      },
      include: {
        model: Category,
        as: 'categories', // Especifica el alias aquí
      },
    });

    const allProductsData = allProducts.map((product) => {
      const productData = product.toJSON();
      productData.categories = productData.categories.map((category) => ({
        id: category.id,
        name: category.name,
      }));
      return productData;
    });

    res.status(200).json(allProductsData);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, urlImage, categoryIds } = req.body;

    // Inicia una transacción
    const transaction = await sequelize.transaction();

    try {
      // Crea el producto
      const newProduct = await Product.create(
        {
          name,
          description,
          price,
          urlImage,
        },
        { transaction }
      );

      // Verifica que las categorías seleccionadas existan
      const selectedCategories = await Category.findAll({
        where: {
          id: categoryIds,
        },
      });

      if (selectedCategories.length !== categoryIds.length) {
        // Alguna categoría no existe
        await transaction.rollback();
        return res.status(400).json({ message: 'One or more selected categories do not exist' });
      }

      // Asocia el producto con las categorías seleccionadas
      await newProduct.addCategories(selectedCategories, { transaction });

      // Hace commit de la transacción
      await transaction.commit();

      // Busca el producto con las categorías asociadas
      const productWithCategories = await Product.findByPk(newProduct.id, {
        include: [{ model: Category, as: 'categories', attributes: ['id', 'name'] }],
      });

      console.log('Producto creado correctamente', productWithCategories);
      res.status(201).json(productWithCategories);
    } catch (error) {
      // Rollback de la transacción en caso de error
      await transaction.rollback();

      console.error('Error al crear el producto:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Cambia el valor de 'deleted' a true en lugar de destruir físicamente el producto
    await product.update({ deleted: true });

    res.status(204).send();
  } catch (error) {
    console.error('Error al marcar el producto como eliminado:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verifica si el producto ha sido eliminado
    if (product.deleted) {
      return res.status(400).json({ message: 'No se puede actualizar un producto eliminado' });
    }

    const { name, description, price, urlImage } = req.body;
    product.name = name;
    product.description = description;
    product.price = price;
    product.urlImage = urlImage;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
