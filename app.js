require('dotenv').config();
const express       = require('express');
const cron          = require('node-cron');
const basicAuth     = require('./middlewares/basicAuth');
const ordersRouter  = require('./routes/orders');
const ordersService = require('./services/ordersService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🔒 Basic Auth tylko na /api/orders
app.use('/api/orders', basicAuth);

// Twoje endpointy
app.use('/api/orders', ordersRouter);

// Cron job (co 5 minut, zgodnie z poprzednią konfiguracją)
async function job() {
  const now = new Date().toISOString();
  console.log(`[${now}] ▶️ Rozpoczynam fetch+transform…`);
  try {
    await ordersService.fetchAndTransform();
    console.log(`[${now}] ✅ Sukces fetch+transform`);
  } catch (err) {
    console.error(`[${now}] ❌ Błąd fetch+transform:`, err.message);
  }
}
job();
cron.schedule('*/5 * * * *', job);

app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
