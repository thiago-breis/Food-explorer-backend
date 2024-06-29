const Router = require('express');
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const DishesController = require('../controllers/DishesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const DishesImagesController = require('../controllers/DishesImagesController');


const upload = multer(uploadConfig.MULTER);
const dishesRoutes = Router();

const dishesController = new DishesController();
const dishesImagesController = new DishesImagesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.post("/", upload.single('imageDish'), dishesController.create);
dishesRoutes.put("/:id", upload.single('imageDish'), dishesController.update);
dishesRoutes.patch("/:id", upload.single("imageDish"), dishesImagesController.update);

module.exports = dishesRoutes;