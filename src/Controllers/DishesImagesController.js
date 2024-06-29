const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/appError");
const knex = require("../database/knex");

class DishesImagesController {
  async update(request, response){

    const imageFilename = request.file.filename;
    const user_id = request.user.id;
    const id = request.params;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes")
      .where(id).first();

    const user = await knex("users")
      .where({id: user_id}).first();

    if(!user){
      throw new AppError("Somente usuários autenticados podem mudar a imagem!", 401)
    }

    if(dish.image){
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFilename);
    dish.image = filename;

    await knex("dishes").update(dish).where(id);

    return response.json(dish);
  }

}


module.exports = DishesImagesController;