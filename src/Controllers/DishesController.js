const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController{

  async create(request, response){

    const { name, price, description, ingredients, categorie_id } = request.body;
    const imageDishFilename = request.file.filename;
    const user_id = request.user.id; 

    const ingredientsArray = ingredients.split(',');

    const diskStorage = new DiskStorage(); 

    const user = await knex("users")
      .where({id: user_id}).first();

    if(!user){
      throw new AppError("Somente usuários autenticados podem cadastrar pratos!", 401)
    }

    const filename = await diskStorage.saveFile(imageDishFilename);

    //first insert dish
    const [ dish_id ] = await knex("dishes").insert({
      name,
      price,
      description,
      image: filename, 
      categorie_id,
      user_id
    });

    //after insert ingredients array
    const ingredientsInsert = ingredientsArray.map(ingredient => {
      return {
        dish_id,
        user_id,
        name: ingredient
      };
    });

    await knex("ingredients").insert(ingredientsInsert);

    const commonDish = {
      dish_id,
      user_id
    }

    await knex("create_common_dish").insert(commonDish);

    return response.status(201).json('Dish created with success!');
  }

  async update(request, response){
    
    const { name, price, description, categorie_id, ingredients } = request.body;
    const { id } = request.params;
    const { id: user_id } = request.user;
    
    const imageDishFilename = request.file?.filename
    const parsedIngredients = JSON.parse(ingredients);

    const diskStorage = new DiskStorage();

    if (imageDishFilename) {
      var filename = await diskStorage.saveFile(imageDishFilename);
    } else {
      console.error('O filename é undefined');
    }
    
    const ingredientsUpdate = parsedIngredients.map(ingredient => {
      return {
        name: ingredient.name,
        user_id,
        dish_id: id
      };
    });

    (async function replaceIngredients() {

      //exclusão de todos os ingredients
      await knex('ingredients')
          .where('dish_id', id)
          .del();

      //inserção novamente
      await knex('ingredients')
      .insert(ingredientsUpdate);

    })();


    await knex("dishes").update({
      name,
      image: filename,
      price,
      categorie_id,
      description,
    }).where({id});

    return response.json();
  }

  //método para mostrar um dish somente e seus ingredientes
  async show(request, response){
    try {
      const { id } = request.params;

      const dish = await knex('create_common_dish as a')
      .select(
        'a.id',
        'a.orders',
        'a.dish_id',
        'b.name',
        'b.image',
        'b.price',
        'b.categorie_id',
        'b.description'
      )
      .innerJoin('dishes as b', 'a.dish_id', 'b.id')
      .where('b.id', id)
      .first();

      if (!dish) {
          return response.status(404).json({ error: "Dish not found" });
      }

      const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

      return response.json({
          dish,
          ingredients
      });

      
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }

  }

  //deletar dishes e ingredients em cascata
  async delete(request, response){
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    console.log('Deletado');

    return response.json();
  }

  //tras os pratos e seus ingrdientes para o usuário autenticado
  async index(request, response) { 
    const { name } = request.query; 

    let dishes;
  
    dishes = await knex('dishes as a')
    .select(
      'a.id', 
      'a.name', 
      'a.image', 
      'a.price', 
      'a.description', 
      'a.categorie_id', 
      'c.isLiked', 
      'c.orders',
      'b.id as ingredient_id', 
      'b.name as ingredient_name'
    )
    .where(function() {
      this.where('a.name', 'like', `%${name}%`)
        .orWhere('b.name', 'like', `%${name}%`);
    })
    .leftJoin('ingredients as b', 'a.id', 'b.dish_id')
    .leftJoin('create_common_dish as c', 'a.id', 'c.dish_id')

    function removeDuplicates(arr) {
      const seen = new Set();
      return arr.filter(obj => {
          const duplicate = seen.has(obj.id);
          seen.add(obj.id);
          return !duplicate;
      });
    }

    let uniqueDishes = removeDuplicates(dishes);
    return response.json(uniqueDishes);
  }

}

module.exports = DishesController;