const cryptoContainer = document.getElementById('crypto-container');
const forexTable = document.querySelector('#forex-table tbody');
const convertButton = document.getElementById('convert');
const conversionResult = document.getElementById('conversion-result');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');

// API линкови
const apis = {
  crypto: [
    { name: 'BTC', url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=EUR' },
    { name: 'XRP', url: 'https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=EUR' },
    { name: 'ADA', url: 'https://min-api.cryptocompare.com/data/price?fsym=ADA&tsyms=EUR' },
    { name: 'SOL', url: 'https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=EUR' },
    { name: 'ETH', url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR' },
    { name: 'VET', url: 'https://min-api.cryptocompare.com/data/price?fsym=VET&tsyms=EUR' },
    { name: 'DOT', url: 'https://min-api.cryptocompare.com/data/price?fsym=DOT&tsyms=EUR' },
    { name: 'LINK', url: 'https://min-api.cryptocompare.com/data/price?fsym=LINK&tsyms=EUR' },
    { name: 'THETA', url: 'https://min-api.cryptocompare.com/data/price?fsym=THETA&tsyms=EUR' },
    { name: 'BNB', url: 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=EUR' },
    { name: 'DOGE', url: 'https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=EUR' },
    { name: 'ATOM', url: 'https://min-api.cryptocompare.com/data/price?fsym=ATOM&tsyms=EUR' },
    { name: 'ICP', url: 'https://min-api.cryptocompare.com/data/price?fsym=ICP&tsyms=EUR' },
    { name: 'FIL', url: 'https://min-api.cryptocompare.com/data/price?fsym=FIL&tsyms=EUR' },
    { name: 'TRX', url: 'https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=EUR' },    
    { name: 'PEPE', url: 'https://min-api.cryptocompare.com/data/price?fsym=PEPE&tsyms=EUR' },
    { name: 'AXS', url: 'https://min-api.cryptocompare.com/data/price?fsym=AXS&tsyms=EUR' }
  ],
  forex: 'https://v6.exchangerate-api.com/v6/73e17080b39b54fbc6f83e7b/latest/MKD'
};

let exchangeRates = {};

// Ажурираната функција за криптовалути
function fetchCryptoRates() {
  apis.crypto.forEach(api => {
    fetch(api.url)
      .then(res => res.json())
      .then(data => {
        console.log(`Податоци за ${api.name}:`, data); // Debugging
        const eurRate = data.EUR;
        if (eurRate && exchangeRates['EUR']) {
          const mkdRate = eurRate * exchangeRates['EUR'];
          addCryptoToTable(api.name, mkdRate);
        } else {
          console.error(`Не може да се добијат податоци за ${api.name}`);
        }
      })
      .catch(err => console.error(`Грешка при фетчирање ${api.name}:`, err));
  });
}

function fetchForexRates() {
  fetch(apis.forex)
    .then(res => res.json())
    .then(data => {
      console.log('Forex податоци:', data); // Debugging
      if (data.result !== 'success') {
        console.error('Грешка при добивање на податоците за обмен на валути');
        return;
      }
      exchangeRates = data.conversion_rates; // Достапување на курсевите
      populateCurrencySelectors();
      addForexToTable();
      fetchCryptoRates(); // Повикај ги крипто податоците
    })
    .catch(err => console.error('Грешка при фетчирање на forex rates:', err));
}


// Пополнување валути во селектори
function populateCurrencySelectors() {
  Object.keys(exchangeRates).forEach(currency => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    fromCurrency.appendChild(option.cloneNode(true));
    toCurrency.appendChild(option.cloneNode(true));
  });
}

function addCryptoToTable(name, rate) {
  // Земаме курс за Евро во Денар (од Forex API)
  const euroToMkd = 1 / exchangeRates['EUR'];  // Курс на евро во денар
  if (euroToMkd) {
    const rateInMkd = rate * euroToMkd * (euroToMkd); // Конвертирање на криптовалута од евро во денар, малку не исправно ама функционира xD
    // Ако вредноста е мала, не ја покажуваме
    if (rateInMkd > 0.01) {
      console.log(`${name} - Евро: ${rate} => Конвертирано во MKD: ${rateInMkd.toFixed(2)}`);
      const box = document.createElement('div');
      box.className = 'crypto-box';
      box.innerHTML = `
      <h3>${name}</h3>
      <p>${rateInMkd.toFixed(2)} MKD</p>
      <p>${(rateInMkd * exchangeRates['EUR']).toFixed(2)} EUR</p>
      <p>${(rateInMkd * exchangeRates['CHF']).toFixed(2)} CHF</p>
      <p>${(rateInMkd * exchangeRates['GBP']).toFixed(2)} GBP</p>
      <p>${(rateInMkd * exchangeRates['USD']).toFixed(2)} USD</p>
      `;
      cryptoContainer.appendChild(box);
    } else {
      console.log(`${name} има мала вредност: ${rateInMkd.toFixed(2)} MKD`);
    }
  } else {
    console.error('Не може да се најде курс за Евро (EUR) во денар.');
  }
}




function addForexToTable() {
  const selectedCurrencies = ['EUR', 'CHF', 'GBP', 'USD', 'CAD', 'AUD', 'CNY', 'JPY', 'RUB', 'RSD', 'ALL'];
  selectedCurrencies.forEach(currency => {
    if (exchangeRates[currency]) {
      const rate = 1 / exchangeRates[currency];
      const row = document.createElement('tr');
      row.innerHTML = `<td>${currency} (${getCurrencyName(currency)})</td><td>${rate.toFixed(2)} MKD</td>`;
      forexTable.appendChild(row);
    }
  });
}

// Функција за добивање на името на валутата
function getCurrencyName(currency) {
  const names = {
    'EUR': 'Евро',
    'CHF': 'Швајцарски франак',
    'GBP': 'Британска фунта',
    'USD': 'Американски долар',
    'CAD': 'Канадски долар',
    'AUD': 'Австралиски долар',
    'CNY': 'Кинески јуани',
    'JPY': 'Јапонски јен',
    'RUB': 'Руски рубли',
    'RSD': 'Српски динар',
    'ALL': 'Албански Лек'
  };
  return names[currency] || currency;
}

// Конверзија
convertButton.addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || !exchangeRates[from] || !exchangeRates[to]) {
    conversionResult.textContent = 'Невалиден износ или валута!';
    return;
  }

  const result = (amount * (1 / exchangeRates[from])) * exchangeRates[to];
  conversionResult.textContent = `Резултат: ${result.toFixed(2)} ${to}`;
});

// Стартување
fetchForexRates();
