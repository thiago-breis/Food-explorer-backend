const knex = require("../database/knex");

class CategoriesController{
  async index(request, response){

    const categories = await knex("categories").orderBy("id");

    return response.json(
      categories
    );
  }
}

module.exports = CategoriesController;