const Router = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const IngredientsController = require('../controllers/IngredientsController');

const ingredientsRoutes = Router();
const ingredientsController = new IngredientsController();

ingredientsRoutes.use(ensureAuthenticated);

// ingredientsRoutes.post("/", ingredientsController.create);
ingredientsRoutes.get("/:dish_id", ingredientsController.index);
// ingredientsRoutes.get("/:id", ingredientsController.show);
// ingredientsRoutes.delete("/:id", ingredientsController.delete);
// ingredientsRoutes.put("/:id", ingredientsController.update);

//exporta
module.exports = ingredientsRoutes;