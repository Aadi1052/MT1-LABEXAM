import express from 'express';

const app = express();
const PORT = 4000;

// B1: Middleware to parse incoming JSON requests
app.use(express.json());

// B1 & B3: Initialize shopping cart array with at least 3 sample items
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
    totalPrice: 1598
  },
  {
    id: 2,
    productName: "Mechanical Keyboard",
    price: 2499,
    quantity: 1,
    category: "Electronics",
    totalPrice: 2499
  },
  {
    id: 3,
    productName: "USB-C Hub",
    price: 1299,
    quantity: 1,
    category: "Accessories",
    totalPrice: 1299
  }
];

// Helper function to calculate total price
const calculateTotalPrice = (price, quantity) => price * quantity;

// ==========================================
// B2: REST API CRUD Endpoints
// ==========================================

// 1. GET /cart - Retrieve all cart items
app.get('/cart', (req, res) => {
  res.status(200).json(cart);
});

// 2. GET /cart/:id - Retrieve a cart item by ID
app.get('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  if (isNaN(itemId)) {
    return res.status(400).json({ message: "Invalid product ID format. ID must be an integer." });
  }

  const product = cart.find(item => item.id === itemId);

  if (!product) {
    return res.status(404).json({ message: `Product with ID ${itemId} not found` });
  }

  // Ensure total price is calculated and returned
  const responseProduct = {
    ...product,
    totalPrice: calculateTotalPrice(product.price, product.quantity)
  };

  res.status(200).json(responseProduct);
});

// 3. POST /cart - Add a new product to the cart
app.post('/cart', (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  // Validation: ensure required fields are present
  if (id === undefined || !productName || price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "Validation failed: id, productName, price, and quantity are required."
    });
  }

  const parsedId = parseInt(id, 10);
  const parsedPrice = parseFloat(price);
  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedId) || isNaN(parsedPrice) || isNaN(parsedQuantity)) {
    return res.status(400).json({
      message: "Validation failed: id, price, and quantity must be valid numbers."
    });
  }

  if (parsedPrice < 0 || parsedQuantity <= 0) {
    return res.status(400).json({
      message: "Validation failed: price must be >= 0 and quantity must be > 0."
    });
  }

  // Check if product with ID already exists
  const existingProduct = cart.find(item => item.id === parsedId);
  if (existingProduct) {
    return res.status(400).json({
      message: `Product with ID ${parsedId} already exists in the cart.`
    });
  }

  const newProduct = {
    id: parsedId,
    productName: String(productName).trim(),
    price: parsedPrice,
    quantity: parsedQuantity,
    category: category ? String(category).trim() : "Electronics",
    totalPrice: calculateTotalPrice(parsedPrice, parsedQuantity)
  };

  cart.push(newProduct);

  // Return HTTP status code 201 with created product
  return res.status(201).json({
    message: "Product added successfully",
    product: newProduct
  });
});

// 4. PUT /cart/:id - Update product details
app.put('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  if (isNaN(itemId)) {
    return res.status(400).json({ message: "Invalid product ID format. ID must be an integer." });
  }

  const productIndex = cart.findIndex(item => item.id === itemId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${itemId} not found` });
  }

  const { productName, price, quantity, category } = req.body;

  // Validation for provided update values
  if (productName !== undefined && String(productName).trim() === '') {
    return res.status(400).json({ message: "Validation failed: productName cannot be empty." });
  }
  if (price !== undefined && (isNaN(price) || parseFloat(price) < 0)) {
    return res.status(400).json({ message: "Validation failed: price must be a non-negative number." });
  }
  if (quantity !== undefined && (isNaN(quantity) || parseInt(quantity, 10) <= 0)) {
    return res.status(400).json({ message: "Validation failed: quantity must be greater than 0." });
  }

  const existing = cart[productIndex];
  const updatedProductName = productName !== undefined ? String(productName).trim() : existing.productName;
  const updatedPrice = price !== undefined ? parseFloat(price) : existing.price;
  const updatedQuantity = quantity !== undefined ? parseInt(quantity, 10) : existing.quantity;
  const updatedCategory = category !== undefined ? String(category).trim() : existing.category;

  const updatedProduct = {
    id: existing.id,
    productName: updatedProductName,
    price: updatedPrice,
    quantity: updatedQuantity,
    category: updatedCategory,
    totalPrice: calculateTotalPrice(updatedPrice, updatedQuantity)
  };

  cart[productIndex] = updatedProduct;

  return res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct
  });
});

// 5. DELETE /cart/:id - Remove a product from the cart
app.delete('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  if (isNaN(itemId)) {
    return res.status(400).json({ message: "Invalid product ID format. ID must be an integer." });
  }

  const productIndex = cart.findIndex(item => item.id === itemId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${itemId} not found` });
  }

  cart.splice(productIndex, 1);

  return res.status(200).json({
    message: `Product with ID ${itemId} deleted successfully`
  });
});

// 404 Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// B1: Start Express Application on port 4000
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
