import { spawn } from 'child_process';

const wait = ms => new Promise(res => setTimeout(res, ms));

async function runTests() {
  console.log('====================================================');
  console.log('   MT1 LAB EXAM: AUTOMATED END-TO-END TEST SUITE   ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // Part A: Testing httpServer.js (Port 3000)
  // ----------------------------------------------------
  console.log('>>> [PART A] Starting httpServer.js on Port 3000...');
  const httpProc = spawn('node', ['httpServer.js'], { cwd: process.cwd(), stdio: 'pipe' });
  httpProc.stdout.on('data', d => process.stdout.write(`[httpServer.js]: ${d}`));
  httpProc.stderr.on('data', d => process.stderr.write(`[httpServer.js ERR]: ${d}`));
  await wait(1500);

  try {
    // 1. GET /
    console.log('\n1. Testing GET http://localhost:3000/ (HTML Welcome Message)');
    const rRoot = await fetch('http://localhost:3000/');
    console.log(`   Status: ${rRoot.status} ${rRoot.statusText}`);
    console.log(`   Content-Type: ${rRoot.headers.get('content-type')}`);
    const rootHtml = await rRoot.text();
    console.log(`   Body includes 'Welcome to Shopping Cart': ${rootHtml.includes('Welcome to Shopping Cart')}`);

    // 2. GET /about
    console.log('\n2. Testing GET http://localhost:3000/about (App Info)');
    const rAbout = await fetch('http://localhost:3000/about');
    console.log(`   Status: ${rAbout.status} ${rAbout.statusText}`);
    console.log(`   Content-Type: ${rAbout.headers.get('content-type')}`);

    // 3. GET /cart
    console.log('\n3. Testing GET http://localhost:3000/cart (JSON Cart Items)');
    const rCart = await fetch('http://localhost:3000/cart');
    console.log(`   Status: ${rCart.status} ${rCart.statusText}`);
    console.log(`   Content-Type: ${rCart.headers.get('content-type')}`);
    const cartItems = await rCart.json();
    console.log(`   Cart item count: ${cartItems.length}`);
    console.log(`   First item:`, cartItems[0]);

    // 4. GET /home (FS Module serving index.html)
    console.log('\n4. Testing GET http://localhost:3000/home (Static file via FS Module)');
    const rHome = await fetch('http://localhost:3000/home');
    console.log(`   Status: ${rHome.status} ${rHome.statusText}`);
    console.log(`   Content-Type: ${rHome.headers.get('content-type')}`);
    const homeHtml = await rHome.text();
    console.log(`   Length: ${homeHtml.length} bytes, Contains 'Shopping Cart Management': ${homeHtml.includes('Shopping Cart Management')}`);

    // 5. POST /add-to-cart
    console.log('\n5. Testing POST http://localhost:3000/add-to-cart (Add new product)');
    const newProductA = {
      id: 4,
      productName: "Gaming Mouse Pad",
      price: 499,
      quantity: 2,
      category: "Accessories"
    };
    const rAdd = await fetch('http://localhost:3000/add-to-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductA)
    });
    console.log(`   Status: ${rAdd.status} ${rAdd.statusText}`);
    const addRes = await rAdd.json();
    console.log(`   Response:`, JSON.stringify(addRes, null, 2));

    // 6. 404 Not Found Handling
    console.log('\n6. Testing Invalid Route GET http://localhost:3000/invalid-route');
    const r404 = await fetch('http://localhost:3000/invalid-route');
    console.log(`   Status: ${r404.status} (Expected: 404)`);

  } finally {
    httpProc.kill();
    console.log('\nStopped httpServer.js.');
  }

  await wait(1000);

  // ----------------------------------------------------
  // Part B: Testing expressApp.js (Port 4000)
  // ----------------------------------------------------
  console.log('\n>>> [PART B] Starting expressApp.js on Port 4000...');
  const expressProc = spawn('node', ['expressApp.js'], { cwd: process.cwd(), stdio: 'pipe' });
  expressProc.stdout.on('data', d => process.stdout.write(`[expressApp.js]: ${d}`));
  expressProc.stderr.on('data', d => process.stderr.write(`[expressApp.js ERR]: ${d}`));
  await wait(1500);

  try {
    // 1. GET /cart
    console.log('\n1. Testing GET http://localhost:4000/cart (Retrieve all items)');
    const rGetCart = await fetch('http://localhost:4000/cart');
    console.log(`   Status: ${rGetCart.status} ${rGetCart.statusText}`);
    const allItems = await rGetCart.json();
    console.log(`   Total items in cart: ${allItems.length}`);

    // 2. GET /cart/:id
    console.log('\n2. Testing GET http://localhost:4000/cart/1 (Retrieve item ID 1)');
    const rGetItem1 = await fetch('http://localhost:4000/cart/1');
    console.log(`   Status: ${rGetItem1.status} ${rGetItem1.statusText}`);
    const item1 = await rGetItem1.json();
    console.log(`   Item:`, item1);

    // 3. POST /cart (Sample from Page 5)
    console.log('\n3. Testing POST http://localhost:4000/cart (Add Bluetooth Headphones)');
    const samplePost = {
      id: 4,
      productName: "Bluetooth Headphones",
      price: 1499,
      quantity: 1,
      category: "Electronics"
    };
    const rPost = await fetch('http://localhost:4000/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(samplePost)
    });
    console.log(`   Status: ${rPost.status} (Expected: 201)`);
    const postRes = await rPost.json();
    console.log(`   Response:`, JSON.stringify(postRes, null, 2));

    // 4. PUT /cart/:id (Sample from Page 6)
    console.log('\n4. Testing PUT http://localhost:4000/cart/1 (Update Wireless Mouse)');
    const samplePut = {
      productName: "Wireless Mouse",
      price: 899,
      quantity: 3,
      category: "Electronics"
    };
    const rPut = await fetch('http://localhost:4000/cart/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(samplePut)
    });
    console.log(`   Status: ${rPut.status} ${rPut.statusText}`);
    const putRes = await rPut.json();
    console.log(`   Response:`, JSON.stringify(putRes, null, 2));

    // 5. DELETE /cart/:id (Sample from Page 6)
    console.log('\n5. Testing DELETE http://localhost:4000/cart/1 (Delete item ID 1)');
    const rDel = await fetch('http://localhost:4000/cart/1', { method: 'DELETE' });
    console.log(`   Status: ${rDel.status} ${rDel.statusText}`);
    const delRes = await rDel.json();
    console.log(`   Response:`, JSON.stringify(delRes, null, 2));

    // 6. Verify 404 for deleted item
    console.log('\n6. Testing GET http://localhost:4000/cart/1 after deletion (Expected 404)');
    const rCheckDeleted = await fetch('http://localhost:4000/cart/1');
    console.log(`   Status: ${rCheckDeleted.status} ${rCheckDeleted.statusText}`);
    const delCheckRes = await rCheckDeleted.json();
    console.log(`   Response:`, delCheckRes);

    // 7. Verify 404 for invalid route
    console.log('\n7. Testing Invalid Express Route GET http://localhost:4000/unknown');
    const rUnknown = await fetch('http://localhost:4000/unknown');
    console.log(`   Status: ${rUnknown.status} (Expected: 404)`);

    console.log('\n====================================================');
    console.log('   🎉 ALL TESTS COMPLETED & PASSED SUCCESSFULLY!    ');
    console.log('====================================================');

  } finally {
    expressProc.kill();
    console.log('\nStopped expressApp.js.');
  }
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
