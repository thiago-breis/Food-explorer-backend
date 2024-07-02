const Router = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const CategoriesController = require('../controllers/CategoriesController');

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.use(ensureAuthenticated);

categoriesRoutes.get("/", categoriesController.index);

module.exports = categoriesRoutes;