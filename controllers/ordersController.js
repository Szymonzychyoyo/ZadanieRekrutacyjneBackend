const ordersService = require('../services/ordersService');

exports.list = (req, res) => {
  const minWorth = req.query.minWorth ? parseFloat(req.query.minWorth) : null;
  const maxWorth = req.query.maxWorth ? parseFloat(req.query.maxWorth) : null;
  const orders = ordersService.getFiltered({ minWorth, maxWorth });
  res.json(orders);
};

exports.csv = (req, res) => {
  const minWorth = req.query.minWorth ? parseFloat(req.query.minWorth) : null;
  const maxWorth = req.query.maxWorth ? parseFloat(req.query.maxWorth) : null;
  const orders = ordersService.getFiltered({ minWorth, maxWorth });
  const csvData = ordersService.toCSV(orders);

  res.header('Content-Type', 'text/csv');
  res.attachment('orders.csv');
  res.send(csvData);
};

exports.getOne = (req, res) => {
  const order = ordersService.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
};
