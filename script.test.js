/**
 * tests/script.test.js
 * 
 * To run these tests:
 * 1. Initialize npm: `npm init -y`
 * 2. Install jest and jsdom: `npm install --save-dev jest jest-environment-jsdom`
 * 3. Add to package.json scripts: `"test": "jest --env=jsdom"`
 * 4. Run `npm test`
 */

// Since script.js is written as a vanilla browser script (no module.exports),
// we read the file and evaluate it inside Jest's JSDOM environment.
const fs = require('fs');
const path = require('path');

const scriptCode = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');

describe('getProducts function', () => {
    let mockContainer;
    let mockLoader;

    beforeEach(() => {
        // Step 1: Setup a simulated DOM environment before each test
        document.body.innerHTML = `
            <div id="loader" style="display: block;">Loading...</div>
            <div id="products-container" class="hidden"></div>
            <span id="cart-count">0</span>
            <div id="cart-items-container"></div>
            <span id="cart-total">$0.00</span>
        `;
        
        mockLoader = document.getElementById('loader');
        mockContainer = document.getElementById('products-container');

        // Step 2: Inject the vanilla JS logic into the global window
        window.eval(scriptCode);

        // Step 3: Mock the global fetch API
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch products and render them successfully', async () => {
        // Arrange
        const mockProducts = [
            { id: 1, title: 'Item 1', price: 10, category: 'Test', image: 'img1.png' },
            { id: 2, title: 'Item 2', price: 20, category: 'Test', image: 'img2.png' }
        ];
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts
        });

        // Act
        // Because getProducts is defined in the eval'd script, we can call it on window
        await window.getProducts();

        // Assert
        // 1. Verify fetch was called with correct URL
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products');
        
        // 2. Verify loader is hidden and container is shown
        expect(mockLoader.style.display).toBe('none');
        expect(mockContainer.classList.contains('hidden')).toBe(false);

        // 3. Verify exactly two products were rendered into the DOM
        const renderedCards = mockContainer.querySelectorAll('.product-card');
        expect(renderedCards.length).toBe(2);
        
        // 4. Verify specific content in the DOM
        expect(renderedCards[0].innerHTML).toContain('Item 1');
        expect(renderedCards[1].innerHTML).toContain('$20.00');
    });

    test('should handle API errors and show error message', async () => {
        // Arrange: Make the fetch fail (e.g. 404 or 500)
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Act
        await window.getProducts();

        // Assert
        expect(mockLoader.innerHTML).toContain('Failed to load products');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
