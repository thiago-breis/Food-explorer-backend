const { Router } = require("express");

const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes");
const sessionsRoutes = require("./sessions.routes");
const ingredientsRoutes = require("./ingredients.routes");
const categoriesRoutes = require("./categories.routes");
const commonDishesOrdersRoutes = require("./commonDishesOrders.routes");

const routes = Router();

routes.use("/users", usersRoutes)
routes.use("/dishes", dishesRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/dish/ingredients", ingredientsRoutes)
routes.use("/dish/categories", categoriesRoutes)
routes.use("/dish/commonDishesOrders", commonDishesOrdersRoutes)

module.exports = routes;