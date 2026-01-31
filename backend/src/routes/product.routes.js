const express = require('express');
const validate = require('../middlewares/validate.middleware');
const productValidation = require('../validations/product.validation');
const productController = require('../controllers/product.controller');
const { auth, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
    .get(productController.getProducts)
    .post(auth, authorize('vendor'), validate(productValidation.createProduct), productController.createProduct);

router.get('/my-products', auth, authorize('vendor'), productController.getMyProducts);

router.route('/:id')
    .get(productController.getProduct);

router.get('/my-products', auth, authorize('vendor'), productController.getMyProducts);

module.exports = router;
