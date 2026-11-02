import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory Shopping Cart Array
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

// Create HTTP Server using http.createServer()
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // A2: Route GET / -> Welcome message in HTML format
  if (pathname === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Shopping Cart Application</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2.5rem; background: #f8fafc; color: #1e293b; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          h1 { color: #2563eb; margin-bottom: 0.75rem; }
          p { margin-bottom: 1rem; line-height: 1.6; }
          ul { list-style: none; padding: 0; }
          li { padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Shopping Cart Application</h1>
          <p>The server is running successfully using the native <strong>Node.js HTTP module</strong>.</p>
          <h3>Quick Links:</h3>
          <ul>
            <li><a href="/cart">/cart</a> — View shopping cart items (JSON)</li>
            <li><a href="/about">/about</a> — Application Information</li>
            <li><a href="/home">/home</a> — Static Home Page (Served using FS Module)</li>
          </ul>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // A2 & A3: Route GET /cart -> List of shopping cart items in JSON format
  if (pathname === '/cart' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cart, null, 2));
    return;
  }

  // A2: Route GET /about -> Shopping cart application information
  if (pathname === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>About - Shopping Cart Application</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2.5rem; background: #f8fafc; color: #1e293b; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          h1 { color: #2563eb; margin-bottom: 0.75rem; }
          p { margin-bottom: 0.75rem; line-height: 1.6; }
          a { color: #2563eb; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>About Shopping Cart Application</h1>
          <p><strong>Examination:</strong> Full Stack Development – Node.js Lab Examination (MT1)</p>
          <p><strong>Technologies:</strong> Node.js, HTTP Module, FS Module, Express.js</p>
          <p><strong>Description:</strong> Demonstrates core Node.js capabilities including creating a native HTTP web server, routing, request method handling, static file delivery via the File System (FS) module, and REST APIs without third-party frameworks in Part A.</p>
          <p><a href="/">← Back to Welcome Page</a></p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  // A2 & A4: Route GET /home -> Serve static HTML page using FS module
  if (pathname === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: Failed to load index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // A3: Route POST /add-to-cart -> Accept product details in JSON format
  if (pathname === '/add-to-cart' && method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { id, productName, price, quantity, category } = payload;

        // A5: Validation of required fields: id, productName, price, and quantity
        if (id === undefined || !productName || price === undefined || quantity === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: "Validation failed: id, productName, price, and quantity are required."
          }));
          return;
        }

        const numId = Number(id);
        const numPrice = Number(price);
        const numQuantity = Number(quantity);

        if (isNaN(numId) || isNaN(numPrice) || isNaN(numQuantity) || numPrice < 0 || numQuantity <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: "Validation failed: id, price, and quantity must be valid numbers (price >= 0, quantity > 0)."
          }));
          return;
        }

        // Check for duplicate ID
        const exists = cart.some(item => item.id === numId);
        if (exists) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: `Product with ID ${numId} already exists in the cart.`
          }));
          return;
        }

        const newProduct = {
          id: numId,
          productName: String(productName).trim(),
          price: numPrice,
          quantity: numQuantity,
          category: category || "General",
          totalPrice: numPrice * numQuantity
        };

        cart.push(newProduct);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: "Product added to cart successfully",
          product: newProduct
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: "Invalid JSON format in request body."
        }));
      }
    });
    return;
  }

  // A5: 404 for invalid routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: "404 Not Found: The requested route does not exist."
  }));
});

// A1: Listen on Port 3000
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
