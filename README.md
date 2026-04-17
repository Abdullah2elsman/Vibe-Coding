# Aurora E-Commerce Showcase

Welcome to the **Aurora E-Commerce** project! This is a simple, beautifully designed, and highly responsive vanilla web application built without any heavy frameworks.

## 🚀 Project Overview

The goal of this project was to build a clean and modern e-commerce front-end using only **HTML, CSS, and Vanilla JavaScript**, while fetching and displaying product data dynamically.

### What We Did

1. **Structured the Layout (`index.html`)**
   - Created a semantic HTML5 template with a stylish header, a hero section, and an empty grid to hold our products.
   - Added a dynamic "Cart" icon up top to track user interaction.

2. **Added Premium Aesthetics (`style.css`)**
   - Designed a sleek **Dark Mode** UI using slate-colored backgrounds and glassmorphism (translucent) product cards.
   - Used CSS variables to easily manage colors (Indigo and Purple accents).
   - Added smooth micro-animations (like hover zooms and an interactive cart bounce) to make the experience feel premium.

3. **Built the Core Logic (`script.js`)**
   - Wrote a clean, well-commented `getProducts()` function.
   - Configured it to fetch data asynchronously, handle loading states, and dynamically generate HTML markup for each product using the DOM (`renderProducts()`).

4. **Mocked the Backend Engine (`db.json`)**
   - Initially built to fetch from the public *FakeStoreAPI*.
   - We then transitioned to a local setup utilizing **JSON Server**. We created `db.json` and populated it with 10 high-quality mock products (complete with prices, categories, and Unsplash imagery).
   - Pointed `script.js` to fetch directly from `http://localhost:3000/products`.

---

## 💻 How to Run This Project Locally

To see the store in action, you need to run the local `json-server` database and open the website frontend.

### Step 1: Start the Database
Open your terminal in this project folder and run the following command:
```bash
npx -y json-server --watch db.json
```
*This command starts a temporary local server that your website can safely pull data from. Ensure it stays running in the background.*

### Step 2: Open the Storefront
Simply double-click `index.html` or drag it into your web browser. 

You will immediately see the UI load up, request the data from your local server, and render the beautiful product grid!

---

## ✏️ Adding More Products
Want to expand the store? It’s completely dynamic.
1. Make sure your server is running.
2. Open `db.json` in your code editor.
3. Add a new object to the `"products"` array like so:
```json
{
  "id": 11,
  "title": "My Awesome Product",
  "price": 49.99,
  "category": "Gadgets",
  "image": "https://link-to-your-image.jpg"
}
```
4. Save the file and simply refresh your browser. The new product will instantly appear in the grid!
