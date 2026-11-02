# Shopping Cart Management Web Application

> **Course:** Full Stack Development – Node.js Lab Examination (MT1)  
> **Technologies:** Node.js, HTTP Module, FS Module, Express.js  
> **Database:** Not Required (In-Memory JavaScript Array)

---

## 1. Project Overview

This project implements a complete Shopping Cart Management Web Application divided into two independent modules:

1. **Part A — Node.js Built-in HTTP & FS Modules (`httpServer.js` on Port 3000):**
   - Native HTTP server creation without external frameworks (`http.createServer`).
   - Request routing (`/`, `/about`, `/cart`, `/home`).
   - Static file serving via the `fs` module (`public/index.html`).
   - Handling HTTP methods (`GET` for retrieval, `POST` for adding items).
   - Robust error handling (404 for invalid routes, 400 for input validation).

2. **Part B — Express.js REST API (`expressApp.js` on Port 4000):**
   - Express server configuration with JSON body parsing middleware (`express.json()`).
   - Full RESTful CRUD operations:
     - `GET /cart` — Retrieve all shopping cart items.
     - `GET /cart/:id` — Retrieve an individual cart item by route parameter.
     - `POST /cart` — Add a new product to the cart (HTTP 201).
     - `PUT /cart/:id` — Update existing product details.
     - `DELETE /cart/:id` — Remove a product from the cart.
   - Dynamic total price calculation (`price * quantity`).
   - Proper HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

---

## 2. Project Structure

```
MT1-LABEXAM/
│
├── package.json         # ES Modules configuration & dependencies
├── package-lock.json    # Exact dependency tree
├── httpServer.js        # Part A: Native Node.js HTTP server (Port 3000)
├── expressApp.js        # Part B: Express.js REST API server (Port 4000)
├── test_app.js          # Automated end-to-end test verification script
│
├── public/
│   └── index.html       # Static home page served via FS module
│
└── screenshots/         # Evaluation screenshots directory
    └── README.md        # Guide for required examination screenshots
```

---

## 3. Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd MT1-LABEXAM
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 4. Running the Application

Both servers run independently on their designated ports:

### Step 1: Start the HTTP Server (Part A)
In terminal 1:
```bash
node httpServer.js
```
**Expected Console Output:**
```text
HTTP Server running at http://localhost:3000
```

**Browser URLs to Test:**
- `http://localhost:3000/` — Welcome page in HTML format.
- `http://localhost:3000/cart` — Shopping cart items in JSON format.
- `http://localhost:3000/about` — Information about the application.
- `http://localhost:3000/home` — Static `index.html` served using the `fs` module.

---

### Step 2: Start the Express Application (Part B)
In terminal 2:
```bash
node expressApp.js
```
**Expected Console Output:**
```text
Express Server running at http://localhost:4000
```

---

## 5. API Testing (Postman & cURL)

### 1. Retrieve All Cart Items (`GET /cart`)
- **Method:** `GET`
- **URL:** `http://localhost:4000/cart`
- **Expected Status:** `200 OK`

### 2. Retrieve Cart Item by ID (`GET /cart/:id`)
- **Method:** `GET`
- **URL:** `http://localhost:4000/cart/1`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "id": 1,
  "productName": "Wireless Mouse",
  "price": 799,
  "quantity": 2,
  "category": "Electronics",
  "totalPrice": 1598
}
```

### 3. Add a New Product (`POST /cart`)
- **Method:** `POST`
- **URL:** `http://localhost:4000/cart`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```
- **Expected Status:** `201 Created`
- **Expected Response:**
```json
{
  "message": "Product added successfully",
  "product": {
    "id": 4,
    "productName": "Bluetooth Headphones",
    "price": 1499,
    "quantity": 1,
    "category": "Electronics",
    "totalPrice": 1499
  }
}
```

### 4. Update Product Details (`PUT /cart/:id`)
- **Method:** `PUT`
- **URL:** `http://localhost:4000/cart/1`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "productName": "Wireless Mouse",
    "price": 899,
    "quantity": 3,
    "category": "Electronics",
    "totalPrice": 2697
  }
}
```

### 5. Remove a Product from Cart (`DELETE /cart/:id`)
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/cart/1`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Product with ID 1 deleted successfully"
}
```

---

## 6. Automated Verification

To run all automated verification tests at once:
```bash
node test_app.js
```

---

## 7. Submission Checklist

- [x] ES Modules (`"type": "module"`) enabled in `package.json`.
- [x] Part A native HTTP server implemented in `httpServer.js` (port 3000).
- [x] Static file serving implemented using the `fs` module (`/home`).
- [x] Part B Express REST API implemented in `expressApp.js` (port 4000).
- [x] Full CRUD operations (GET, POST, PUT, DELETE) implemented with proper status codes.
- [x] Total price calculated as `price * quantity`.
- [x] Git repository initialized with modular commit history.
- [x] Screenshots folder created with documentation.
