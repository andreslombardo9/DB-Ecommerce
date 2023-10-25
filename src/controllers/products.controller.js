import { Product} from "../models/products.js";

export const getProducts = async (req, res) => {
  try {

    await Product.sync(req, res);
    const allProducts = await Product.findAll();
    const allProductsData = allProducts.map(product => product.dataValues);
    res.status(200).json(allProductsData);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const createProduct = async (req, res) => {
  try {

    const { name, description, price, urlImage} = req.body;


    const newProduct = await Product.create({
      name,
      description,
      price,
      urlImage,
    });


    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
  
    const productId = req.params.id;


    const product = await Product.findByPk(productId);


    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }


    await product.destroy();

 
    res.status(204).send(); 
  } catch (error) {
    console.error('Error al borrar el producto:', error);
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
