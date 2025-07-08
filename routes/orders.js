const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordersController');

// GET /api/orders?minWorth=xx&maxWorth=yy
router.get('/',    ctrl.list);
// GET /api/orders/csv?minWorth=xx&maxWorth=yy
router.get('/csv', ctrl.csv);
// GET /api/orders/:id
router.get('/:id', ctrl.getOne);

module.exports = router;
