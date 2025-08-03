document.addEventListener('DOMContentLoaded', () => {
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const amountInput = document.getElementById('amount');
    const swapButton = document.getElementById('swap-button');
    const rateDisplay = document.getElementById('rate-display');
    const resultDisplay = document.getElementById('result-display');

    const apiKey = '612ca8b53b5d1596a008fb01'; 
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}`;

    // List of common currencies
    const currencies = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"];

    // Populate dropdowns
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        fromCurrencySelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        toCurrencySelect.appendChild(option2);
    });

    // Set default values
    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "INR";

    // Main conversion function
    const convertCurrency = async () => {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = parseFloat(amountInput.value);

        if (isNaN(amount) || amount <= 0) {
            resultDisplay.textContent = "";
            rateDisplay.textContent = "";
            return;
        }

        try {
            rateDisplay.textContent = 'Fetching rate...';
            resultDisplay.textContent = '';
            
            const response = await fetch(`${apiUrl}/latest/${fromCurrency}`);
            const data = await response.json();

            if (data.result === 'error') {
                throw new Error(data['error-type']);
            }

            const rate = data.conversion_rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            
            rateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            resultDisplay.textContent = `${convertedAmount} ${toCurrency}`;

        } catch (error) {
            resultDisplay.textContent = 'Error';
            rateDisplay.textContent = `Could not fetch rate. Please check your connection or API key.`;
            console.error('Error fetching currency data:', error);
        }
    };
    
    // Swap currencies
    const swapCurrencies = () => {
        [fromCurrencySelect.value, toCurrencySelect.value] = [toCurrencySelect.value, fromCurrencySelect.value];
        convertCurrency();
    };

    // Event listeners
    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    swapButton.addEventListener('click', swapCurrencies);
    
    // Initial conversion on page load
    convertCurrency();
});