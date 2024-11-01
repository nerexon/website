class PricingCalculator {
    constructor() {
        this.pricingModels = new Map();
    }

    definePricingModel(model) {
        this.pricingModels.set(model.id, model);
    }

    calculatePrice(productId, config) {
        const model = this.pricingModels.get(productId);
        if (!model) throw new Error(`No pricing model found for product ${productId}`);

        let basePrice = this.calculateBasePrice(model, config);
        let totalPrice = basePrice;
        let discounts = [];

        // Apply modifiers
        if (model.priceModel.modifiers) {
            model.priceModel.modifiers.forEach(modifier => {
                const { type, ...params } = modifier;
                const modifierResult = this.applyModifier(type, params, totalPrice, config);
                if (modifierResult.discount > 0) {
                    discounts.push({
                        type: type,
                        amount: modifierResult.discount
                    });
                    totalPrice -= modifierResult.discount;
                }
            });
        }

        return {
            basePrice: basePrice,
            discounts: discounts,
            totalPrice: totalPrice
        };
    }

    calculateBasePrice(model, config) {
        const { type, tiers, basePrice } = model.priceModel;
        const { quantity } = config;

        switch (type) {
            case 'fixed':
                return basePrice;
            case 'perUnit':
                return basePrice * quantity;
            case 'tiered':
            case 'graduated':
                let total = 0;
                let remainingUnits = quantity;
                for (const tier of tiers) {
                    if (remainingUnits <= 0) break;
                    const tierUnits = Math.min(remainingUnits, tier.max - tier.min + 1);
                    total += tierUnits * tier.rate;
                    remainingUnits -= tierUnits;
                }
                return total;
            default:
                throw new Error(`Unsupported pricing model type: ${type}`);
        }
    }

    applyModifier(type, params, currentPrice, config) {
        switch (type) {
            case 'commitmentDiscount':
                const { discounts } = params;
                const { commitment } = config;
                const discount = discounts[commitment] || 0;
                return {
                    discount: currentPrice * discount
                };
            case 'volumeDiscount':
                const { threshold, discount: volumeDiscount } = params;
                const { quantity } = config;
                if (quantity >= threshold) {
                    return {
                        discount: currentPrice * volumeDiscount
                    };
                }
                return { discount: 0 };
            default:
                return { discount: 0 };
        }
    }
}

// Initialize the calculator
const calculator = new PricingCalculator();

// Define sample pricing model
const samplePricingModel = {
    id: 'virtual-machines',
    name: 'Virtual Machines',
    priceModel: {
        type: 'graduated',
        currency: 'USD',
        basePrice: 10,
        tiers: [
            { min: 0, max: 100, rate: 1.00 },
            { min: 101, max: 1000, rate: 0.75 },
            { min: 1001, max: Infinity, rate: 0.50 }
        ],
        modifiers: [
            {
                type: 'commitmentDiscount',
                discounts: {
                    monthly: 0,
                    yearly: 0.20
                }
            },
            {
                type: 'volumeDiscount',
                threshold: 5000,
                discount: 0.15
            }
        ]
    }
};

calculator.definePricingModel(samplePricingModel);

// Function to display the calculator
function displayCalculator(productId, container) {
    const model = calculator.pricingModels.get(productId);
    
    container.innerHTML = `
        <h2>${model.name} Calculator</h2>
        <div class="product-input-group">
            <h3>Configuration</h3>
            <div class="input-field">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" min="1" value="1">
            </div>
            <div class="input-field">
                <label for="commitment">Commitment Period</label>
                <select id="commitment">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
        </div>
        <div id="calculationSummary">
            <h3>Summary</h3>
            <div class="summary-item">
                <span>Base Price</span>
                <span id="basePrice">$0.00</span>
            </div>
            <div class="summary-item">
                <span>Discounts</span>
                <span id="discounts">$0.00</span>
            </div>
            <div id="totalPrice">Total: $0.00</div>
        </div>
    `;

    // Add event listeners for real-time calculation
    const inputs = container.querySelectorAll('.input-field input, .input-field select');
    inputs.forEach(input => {
        input.addEventListener('input', () => updateCalculation(productId, container));
    });

    // Initial calculation
    updateCalculation(productId, container);
}

// Function to update the calculation
function updateCalculation(productId, container) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const commitment = document.getElementById('commitment').value;
    const config = { quantity, commitment };
    const result = calculator.calculatePrice(productId, config);
    displayResult(result, container);
}

// Function to display the result
function displayResult(result, container) {
    const basePriceElement = container.querySelector('#basePrice');
    const discountsElement = container.querySelector('#discounts');
    const totalPriceElement = container.querySelector('#totalPrice');
    
    basePriceElement.textContent = `$${result.basePrice.toFixed(2)}`;
    const totalDiscounts = result.discounts.reduce((sum, discount) => sum + discount.amount, 0);
    discountsElement.textContent = `$${totalDiscounts.toFixed(2)}`;
    totalPriceElement.textContent = `Total: $${result.totalPrice.toFixed(2)}`;
}

// Add event listener for product selection
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.side-panel ul ul li').forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.id;
            const productCalculator = document.getElementById('productCalculator');
            
            if (calculator.pricingModels.has(productId)) {
                displayCalculator(productId, productCalculator);
            }
        });
    });
});