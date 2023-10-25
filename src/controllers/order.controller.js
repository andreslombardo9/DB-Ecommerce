import { Order } from "../models/order.js";
import { ProductOrder } from "../models/orderDetails.js";
import { Product } from "../models/products.js";
import { orderSchema } from "../schemas/order.js";


export const createOrder = async (req, res) => {
  try {
    // Obtén el user_id desde el token (si el usuario está autenticado)
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Debes iniciar sesión para crear una orden' });
    }

    const { product_data } = orderSchema.parse(req.body);

    // Verifica que product_data sea un arreglo y no esté vacío
    if (!Array.isArray(product_data) || product_data.length === 0) {
      return res.status(400).json({ message: 'product_data debe ser un arreglo no vacío' });
    }

    // Crea la nueva orden en la base de datos
    const nuevaOrden = await Order.create({
      user_id,
      product_data: JSON.stringify(product_data),
    });

    // Para cada producto en product_data, crea un registro en ProductOrder
    for (const producto of product_data) {
      await ProductOrder.create({
        orders_id: nuevaOrden.id,
        products_id: producto.idProducto,
        quantity: producto.quantity,
      });
    }

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return res.status(500).json({ error });
  }
};



export const getOrders = async (req, res) => {
    try {
        const ordenes = await Order.findAll();
        res.status(200).json(ordenes);
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        return res.status(500).json({ message: 'Algo salió mal' });
      }
}

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

