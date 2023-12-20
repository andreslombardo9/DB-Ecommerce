import { ProductOrder} from '../models/orderDetails.js';
import { Product } from '../models/products.js';

export const createDetallePedido = async (req, res) => {
  try {
    // Obtén los datos del detalle de pedido del cuerpo de la solicitud
    const { cantidad, pedidos_idPedido } = req.body;

    // Crea un nuevo detalle de pedido con los datos
    const newDetallePedido = await ProductOrder.create({
      cantidad,
      pedidos_idPedido,
    });

    // Devuelve el detalle de pedido creado como respuesta
    res.status(201).json(newDetallePedido);
  } catch (error) {
    console.error('Error al crear el detalle de pedido:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getOrdersDeatils = async (req, res) => {
  try {
    const detallesPedidos = await ProductOrder.findAll();
    res.status(200).json(detallesPedidos);
  } catch (error) {
    console.error('Error al obtener los detalles de pedidos:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

export const getOrderDeatilsForId = async (req, res) => {
  const detallePedidoId = req.params.id;
  try {
    const detallePedido = await ProductOrder.findByPk(detallePedidoId);
    if (!detallePedido) {
      return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
    }
    res.status(200).json(detallePedido);
  } catch (error) {
    console.error('Error al obtener el detalle de pedido por ID:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

export const updateOrderDeatilsForId = async (req, res) => {
  const detallePedidoId = req.params.id;
  const { cantidad, pedidos_idPedido } = req.body;
  try {
    const detallePedido = await ProductOrder.findByPk(detallePedidoId);
    if (!detallePedido) {
      return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
    }
    // Actualiza los datos del detalle de pedido
    detallePedido.cantidad = cantidad;
    detallePedido.pedidos_idPedido = pedidos_idPedido;
    await detallePedido.save();
    res.status(200).json(detallePedido);
  } catch (error) {
    console.error('Error al actualizar el detalle de pedido por ID:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

// Importa el modelo Product


// ...

export const calculateOrderTotal = async (productData) => {
  console.log('Datos del producto a analizar:', productData);

  try {
    // Obtén los precios de los productos
    const productPrices = await fetchProductPrices(productData);

    // Calcula el total de la orden utilizando los precios obtenidos
    const total = productData.reduce((accumulator, product) => {
      const productPrice = productPrices.find((p) => p.id === product.idProducto)?.price || 0;
      return accumulator + productPrice * product.quantity;
    }, 0);

    return total.toFixed(2);
  } catch (error) {
    console.error('Error al calcular el total de la orden:', error);
    return 'N/A';
  }
};



// Obtén los precios de los productos
// Dentro de la función fetchProductPrices
export const fetchProductPrices = async (products) => {
  try {
    // Obtén los IDs de los productos
    const productIds = products.map((product) => product.idProducto);

    // Realiza una consulta a la base de datos para obtener los precios
    const productPrices = await Product.findAll({
      attributes: ['id', 'price'],
      where: { id: productIds },
    });

    console.log('Precios de productos obtenidos:', productPrices);

    return productPrices.map((product) => ({ id: product.id, price: product.price }));
  } catch (error) {
    throw error;
  }
};
