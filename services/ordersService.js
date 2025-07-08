
require('dotenv').config();
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');
const { Parser } = require('json2csv');

const DATA_DIR         = path.join(__dirname, '../data');
const RAW_FILE         = path.join(DATA_DIR, 'rawOrders.json');
const TRANSFORMED_FILE = path.join(DATA_DIR, 'orders.json');

const IDOSELL_API_URL = process.env.IDOSELL_API_URL;
const IDOSELL_API_KEY = process.env.IDOSELL_API_KEY;

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchRaw() {
  const url = `${IDOSELL_API_URL}?calaBaza=1`;
  const { data } = await axios.get(url, {
    headers: {
      'x-api-key': IDOSELL_API_KEY,
      'Accept':   'application/json'
    }
  });
  return data;
}

function saveRaw(data) {
  fs.writeFileSync(RAW_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function transform(raw) {
  return (raw.Results || []).map(o => {
    const bc = o.orderDetails.payments.orderBaseCurrency;
    const orderWorth =
      (bc.orderProductsCost  || 0) +
      (bc.orderDeliveryCost  || 0) +
      (bc.orderPayformCost   || 0) +
      (bc.orderInsuranceCost || 0);

    return {
      orderID: o.orderSerialNumber,
      products: (o.orderDetails.productsResults || []).map(p => ({
        productID: p.productId,
        quantity:  p.productQuantity
      })),
      orderWorth
    };
  });
}

function saveTransformed(data) {
  fs.writeFileSync(TRANSFORMED_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function loadTransformed() {
  return JSON.parse(fs.readFileSync(TRANSFORMED_FILE, 'utf-8'));
}

function getFiltered({ minWorth, maxWorth }) {
  let all = loadTransformed();
  if (minWorth != null) all = all.filter(o => o.orderWorth >= minWorth);
  if (maxWorth != null) all = all.filter(o => o.orderWorth <= maxWorth);
  return all;
}

function getById(id) {
  return loadTransformed().find(o => String(o.orderID) === String(id));
}

function toCSV(records) {
  const fields = ['orderID','orderWorth','products'];
  const parser = new Parser({ fields, unwind: 'products' });
  return parser.parse(records);
}

async function fetchAndTransform() {
  try {
    const raw = await fetchRaw();
    saveRaw(raw);
    const transformed = transform(raw);
    saveTransformed(transformed);
    console.log('Zamówienia pobrane i przetransformowane.');
  } catch (e) {
    console.error('Błąd w fetchAndTransform:', e.response?.status, e.message);
  }
}

module.exports = {
  fetchAndTransform,
  getFiltered,
  getById,
  toCSV
};
