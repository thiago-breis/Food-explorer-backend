const knex = require("../database/knex");

class DishesController{

  async update(request, response){
    const { amountOrder, isLiked, dish_id } = request.body;

    if(amountOrder === null){
      await updateWithoutAmountNumber();
    }else{
      await updateWithAmountNumberOrLikeState();
    }

    //atualização sem quantidade de pedido
    async function updateWithoutAmountNumber(){
      //busca o numero de pedidos do prato
      try {

        let { orders }  = await knex
        .select('orders')
        .from('create_common_dish')
        .where({ dish_id })  
        .first();

        if(orders != 0){
          --orders

          await knex("create_common_dish")
            .update({ orders })
            .where({ dish_id })
        }
        
      } catch (error) {
        console.log(error)
        return response.json('Erro ao fazer update dos pedidos');
      }
      
    }

    async function updateWithAmountNumberOrLikeState(){
      try {

        await knex("create_common_dish")
          .update({ orders: amountOrder, isLiked})
          .where({ dish_id });

      } catch (error) {

        console.log(error)
        return response.json('Erro ao atualizar prato ou estado');

      }
    }

    let amountOrders = await knex("create_common_dish")
      .sum("orders")

    amountOrders = amountOrders[0]["sum(`orders`)"];
  
    //busca os pratos atualizados novamente
    const orderDishes = await knex('create_common_dish as a')
      .select(
        'a.id',
        'a.orders',
        'a.dish_id',
        'b.name',
        'b.image',
        'b.price')
      .innerJoin('dishes as b', 'a.dish_id', 'b.id')
      .where('a.orders', '>', 0);
  

    const responseData = {
      orderDishes,
      amountOrders,
    };  

    return response.json(responseData);
  }

  async indexOrder(request, response){
    const sumOrders = await knex("create_common_dish").sum("orders") //.where({ user_id });
    const totalOrders = sumOrders[0]["sum(`orders`)"];

    return response.json(totalOrders);
  }

  async indexOrderDishes(request, response){
    
    //seleção dos pratos do usuário que possuem pedidos
    const orderDishes = await knex('create_common_dish as a')
      .select(
        'a.id',
        'a.orders',
        'a.dish_id',
        'b.name',
        'b.image',
        'b.price')
      .innerJoin('dishes as b', 'a.dish_id', 'b.id')
      .where('a.orders', '>', 0);

    //seleção da soma dos pedidos
    const totalPrice = await knex('dishes as a')
      .select(knex.raw('SUM(a.price * b.orders) AS total_price'))
      .innerJoin('create_common_dish as b', 'a.id', 'b.dish_id')
      .groupBy('a.id')
      .then(rows => {
        const grandTotal = rows.reduce((acc, row) => acc + row.total_price, 0);
        return grandTotal;
    });

    //montagem do objeto de resposta
    const responseData = {
      orderDishes,
      totalPrice
    };
    
    return response.json(responseData);
  }

}

module.exports = DishesController;