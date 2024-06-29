const AppError = require("../utils/appError");
const authConfig = require("../configs/auth");
const knex = require("../database/knex");
const { sign } = require("jsonwebtoken");
const {compare} = require("bcryptjs");

class SessionsController {
  async create(request, response){
    try{
      const { email, password } = request.body;

      const user = await knex("users")
      .where({ email })
      .first();

      if(!user){
        throw new AppError("E-mail e/ou senha incorreta", 401);
      }

      const passwordMatched = await compare(password, user.password);

      if(!passwordMatched){
        throw new AppError("E-mail e/ou senha incorreta", 401);
      }

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
      })

      return response.json({ user, token })

    }catch(error){

      console.log(error);
      return response.status(403).json({error:error.message})

    }
  }

}

module.exports = SessionsController;


//Com o jsonwebtoken é possível usar seu métodos "sign"
//parâmetros : ({}, secret, {subject: id, expiresIn});
// const token = sign({}, secret, {
//   subject: String(user.id),
//   expiresIn
// })