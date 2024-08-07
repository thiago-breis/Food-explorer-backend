const Router = require('express');
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const DishesController = require('../controllers/DishesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const DishesImagesController = require('../Controllers/OrdersController');


const upload = multer(uploadConfig.MULTER);
const dishesRoutes = Router();

const { Router } = require('express')
const multer = require('multer')

const DishesController = require('../controllers/DishesController')
const uploadConfig = require('../configs/upload')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const dishesController = new DishesController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post('/', upload.single('image'), dishesController.create)
dishesRoutes.put('/:id', upload.single('image'), dishesController.update)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)

module.exports = dishesRoutes