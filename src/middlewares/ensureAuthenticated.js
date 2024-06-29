const AppError = require("../utils/appError");
const authConfig = require("../configs/auth");
const { verify } = require("jsonwebtoken");

function ensureAuthentication(request, response, next){

  const authHeader = request.headers.authorization;

  if(!authHeader){
    throw new AppError("JWT Token não informado", 401);
  }

  //formatar o Bearer
  const [bearer,token] = authHeader.split(" ");

  try{
    const {sub: user_id} = verify(token, authConfig.jwt.secret);

    //inserindo dentro de request o valor do id do usuário
    request.user = {
      id : Number(user_id)
    }

    return next();

  }catch{

    throw new AppError("JWT Token inválido", 401);

  }
}

module.exports = ensureAuthentication;