# Understanding Our Jest Tests (`script.test.js`)

This document provides a simple, plain-English breakdown of how the unit tests for our vanilla JavaScript application work.

## The Core Problem: Testing Vanilla JS
In modern applications (like React or Node.js), developers export pieces of code using statements like `export function getProducts()`. However, our e-commerce project uses "Vanilla Javascript" designed purely for the browser, meaning our variables and functions are just floating globally. 

To overcome this so we can test the code in Node.js, we do the following at the top of the file:
```javascript
const scriptCode = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');
```
We actively read `script.js` as a raw text string so we can evaluate it locally later!

---

## 🏗️ 1. The Setup Phase (`beforeEach`)
Before a single test runs, Jest triggers the `beforeEach` function. We need to create a "fake browser" so our Javascript doesn't crash when it looks for HTML elements.

- **Faking the DOM**: We literally inject fake HTML elements into `document.body` (like `<div id="loader">`).
- **Evaluating Code**: We use `eval(scriptCode)`. This tells Jest to execute our raw `script.js` file internally, meaning functions like `getProducts` are suddenly available for us to call on `window.getProducts()`.
- **Faking the Backend**: We say `global.fetch = jest.fn()`. Instead of really connecting to `localhost:3000` (which might be down or slow), we replace `fetch` with a fake spy function we can control.

---

## ✅ 2. The Success Test Scenario
Our first test verifies: **"If the database responds perfectly, does our code render the products?"**

```javascript
test('should fetch products and render them successfully', async () => { ... })
```

### The "Arrange, Act, Assert" Pattern

1. **Arrange (Setup)**:
   We tell our fake `fetch` command: *"When you get called, pretend everything is `ok` and hand over this fake list containing Item 1 and Item 2."*
2. **Act (Execution)**: 
   We trigger our function: `await window.getProducts();`
3. **Assert (Verification)**: We interrogate the code to make sure it did its job!
   - *Did it actually try to fetch from localhost:3000?* (`expect(global.fetch).toHaveBeenCalledWith...`)
   - *Did it hide the loading spinner?* (`expect(mockLoader.style.display).toBe('none')`)
   - *Did it accurately draw exactly 2 product cards?* (`expect(renderedCards.length).toBe(2)`)
   - *Did the HTML inside the card display the fake price ($20.00) properly?*

---

## ❌ 3. The Error Test Scenario
Our second test verifies: **"If the local database crashes or goes offline, does the user gracefully see an error?"**

```javascript
test('should handle API errors and show error message', async () => { ... })
```

1. **Arrange (Setup)**: 
   We tell our fake `fetch` command: *"Pretend the server is offline and give us a spooky 404 error."* We also temporarily mute `console.error` logs so our test console stays clean!
2. **Act (Execution)**:
   We trigger `await window.getProducts();`
3. **Assert (Verification)**:
   We look at the DOM and verify that our HTML loading spinner container was successfully updated to say: `"Failed to load products"`.

--- 

### 🚀 How to actually run it:
1. Open terminal and run `npm init -y` inside the folder.
2. Install the tester by running `npm install --save-dev jest jest-environment-jsdom`.
3. Inside your `package.json` file, change `"test"` to say `"jest --env=jsdom"`.
4. Run: `npm test` and watch the magical green checkmarks appear!
