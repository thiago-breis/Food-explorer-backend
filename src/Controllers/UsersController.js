const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/appError");

class UsersController {

  async create(request, response) {
    try {
      const { name, email, password } = request.body;

      const database = await sqliteConnection();
      const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

      if(checkUserExists){
        throw new AppError("Este email já está em uso!");
      }

      const hashedPassword = await hash(password, 8);

      await database.run("INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)", [name, email, hashedPassword]);

      return response.status(201).json("Usuário criado com sucesso!");

    }catch(error){

      console.error(error);
      return response.status(400).json({ error: error.message  });

    }

  }

  async index(request, response){
    const database = await sqliteConnection();

    const user = await database.all("SELECT id, name, email, created_at FROM USERS");

    if(!user){
      return response.json({"message":"Não foram encontrados usuários no sistema."})
    }

    return response.json(user)
  }

  async show(request, response){
    const { id } = request.params;

    const database = await sqliteConnection();

    const user = await database.get("SELECT id, name, email, created_at FROM USERS WHERE id = (?)", [id]);

    if(!user){
      return response.json("Este usuário não foi encontrado no sistema.");
    }

    return response.json(user)
  }

  async update(request, response){

    const { name, email, password, old_password }  = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE ID = (?)', [user_id])

    console.log(user);

    if (!user) {
      throw new AppError('Usuario nao encontrado')
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail ja esta em uso')
    }

    if( password && !old_password){
      throw new AppError("Informe a senha antiga para definir a nova senha!")
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword){
        throw new AppError("A senha antiga não confere!");
      }

      user.password = await hash(password, 8);
    }

    //evitar preencher vazio
    user.name = name ?? user.name
    user.email = email ?? user.email
    // user.isAdmin = isAdmin ?? user.isAdmin

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ? `, [user.name, user.email, user.password, user.id]);

    return response.status(200).json();

  }

  async delete(resquest, response){
    const { id } = resquest.params;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if(checkUserExists){
      await database.run("DELETE FROM users WHERE id = (?)", [id])
    }

    return response.json();
  }

}

module.exports = UsersController;