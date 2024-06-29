const Router = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const CommonDishesOrdersController = require('../controllers/CommonDishesOrdersController');

const commonDishesOrdersRoutes = Router();
const commonDishesOrdersController = new CommonDishesOrdersController();

commonDishesOrdersRoutes.use(ensureAuthenticated);

commonDishesOrdersRoutes.put("/orders", commonDishesOrdersController.update);
commonDishesOrdersRoutes.get("/orders", commonDishesOrdersController.indexOrder);
commonDishesOrdersRoutes.get("/orders/dishes", commonDishesOrdersController.indexOrderDishes);

module.exports = commonDishesOrdersRoutes;