import { Order } from "../models/order.js";
import { ProductOrder } from "../models/orderDetails.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { calculateOrderTotal } from "./orderDetails.controller.js";



export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Debes iniciar sesión para crear una orden' });
    }

    // Obtener detalles del usuario que creó la orden
    const user = await User.findByPk(user_id, {
      attributes: ['name', 'last_name', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { product_data } = req.body;

    if (!Array.isArray(product_data) || product_data.length === 0) {
      return res.status(400).json({ message: 'product_data debe ser un arreglo no vacío' });
    }

    // Llama a la función para calcular el total
    const total = await calculateOrderTotal(product_data);

    // Crear la orden
    const nuevaOrden = await Order.create({
      user_id,
      product_data: JSON.stringify(product_data),
      total,
    });

    // Crear las entradas en la tabla intermedia ProductOrder con información adicional del producto
    const productOrderEntries = await Promise.all(product_data.map(async (producto) => {
      const product = await Product.findByPk(producto.idProducto);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${producto.idProducto} not found.` });
      }

      return {
        orders_id: nuevaOrden.id,
        products_id: producto.idProducto,
        quantity: producto.quantity,
        product_name: product.name,
        product_price: product.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }));

    await ProductOrder.bulkCreate(productOrderEntries, { validate: true });

    // Devolver la información deseada (nombre y precio de los productos y detalles del usuario)
    const productsInfo = productOrderEntries.map(entry => ({
      product_name: entry.product_name,
      product_price: entry.product_price,
      quantity: entry.quantity,
    }));

    res.status(201).json({ order: nuevaOrden, total, products: productsInfo, user: user.toJSON() });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  
  }
};



export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();

    // Mapea cada orden para incluir información detallada del producto, el total y detalles del usuario
    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      const productData = JSON.parse(order.product_data);

      // Obtén información detallada de cada producto en la orden
      const productDetails = await Promise.all(productData.map(async (product) => {
        const productInfo = await Product.findByPk(product.idProducto);

        if (!productInfo) {
          return res.status(404).json({ message: `Product with ID ${product.idProducto} not found.` });
        }

        return {
          product_name: productInfo.name,
          product_price: productInfo.price,
          quantity: product.quantity,
        };
      }));

      // Calcula el total de la orden
      const total = await calculateOrderTotal(productData);

      // Obtén detalles del usuario que creó la orden
      const user = await User.findByPk(order.user_id, {
        attributes: ['name', 'last_name', 'email'],
      });

      if (!user) {
        return res.status(404).json({ message: `User with ID ${order.user_id} not found.` });
      }

      return {
        ...order.toJSON(),
        products: productDetails,
        total,
        user: user.toJSON(),
      };
    }));

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};




export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Busca la orden por su ID en la base de datos
    const orden = await Order.findByPk(orderId);

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Convierte el campo JSON en un objeto
    const orderDetailer = JSON.parse(orden.product_data);

    let arrayResult = [];
    let costoTotalOrden = 0;

    for (const data of orderDetailer) {
      // Busca el producto por su ID en la base de datos (asumiendo que hay un modelo Product)
      const producto = await Product.findByPk(data.idProducto);

      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const costoTotal = producto.price * data.quantity;
      costoTotalOrden += costoTotal;

      const detalleOrden = {
        idProducto: data.idProducto,
        cantidad: data.quantity,
        costo: costoTotal,
      };

      arrayResult.push(detalleOrden);
    }

    const result = {
      idOrden: orden.id,
      fechaCreacion: orden.createdAt,
      total: costoTotalOrden,
      user: orden.user,
      detalleOrden: arrayResult,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener la orden por ID:', error);
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};


export const updateOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { user_id, product_data } = req.body;

    // Verifica si la orden existe
    const existingOrder = await Order.findByPk(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Actualiza la orden con los nuevos datos
    existingOrder.user_id = user_id;
    existingOrder.product_data = JSON.stringify(product_data);

    // Guarda los cambios en la base de datos
    await existingOrder.save();

    res.status(200).json(existingOrder);
  } catch (error) {
    console.error('Error updating order by ID:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Busca la orden por su ID
    const existingOrder = await Order.findByPk(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Elimina los registros relacionados en la tabla `products_order`
    await ProductOrder.destroy({
      where: { orders_id: orderId }
    });

    // Finalmente, elimina la orden
    await existingOrder.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order by ID:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

